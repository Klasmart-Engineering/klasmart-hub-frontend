import {
    ContentType,
    getContentTypeStr,
    useRestAPI,
} from "@/api/restapi";
import FolderIcon from "@/assets/img/folder.svg";
import Breadcrumbs from "@/components/LibraryContent/Breadcrumbs";
import CreateContentFolderDialog from "@/components/LibraryContent/Folder/Dialog/Create";
import EditContentFolderDialog from "@/components/LibraryContent/Folder/Dialog/Edit";
import DistributeContentFolderDialog from "@/components/LibraryContent/Folder/DistributeDialog";
import MoveContentDialog from "@/components/LibraryContent/MoveDialog";
import globalStyles from "@/globalStyles";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    ContentItemDetails,
    PublishedContentItem,
    PublishedContentPayload,
    PublishStatus,
} from "@/types/objectTypes";
import { handleError } from "@/utils/images";
import { getTableLocalization } from "@/utils/table";
import {
    PageTable,
    usePrompt,
    useSnackbar,
    validations,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import {
    CreateNewFolder as CreateNewFolderIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExitToApp as ExitToAppIcon,
    Share as ShareIcon,
} from "@mui/icons-material";
import {
    Badge,
    Box,
    Chip,
    DialogContentText,
    Divider,
    Link,
    Paper,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React, {
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    useLocation,
    useRouteMatch,
} from "react-router";

const useStyles = makeStyles((theme) => {
    const {
        disabledColor,
        errorColor,
        infoColor,
        successColor,
        warningColor,
        statusText,
    } = globalStyles(theme);
    return createStyles({
        disabledColor,
        errorColor,
        infoColor,
        successColor,
        warningColor,
        statusText,
        root: {
            width: `100%`,
        },
        folderIcon: {
            width: 38,
            height: 30,
            marginRight: theme.spacing(1.5),
        },
        itemThumbnail: {
            height: 38,
            width: 38,
            minHeight: 38,
            minWidth: 38,
            objectFit: `cover`,
            marginRight: theme.spacing(1.5),
            borderRadius: theme.spacing(0.5),
        },
        keywordChip: {
            margin: theme.spacing(0.25),
        },
        contentTypeText: {
            textTransform: `capitalize`,
        },
        unclickableText: {
            pointerEvents: `none`,
        },
    });
});

const getPublishStatusColor = (status: PublishStatus, classes: Record<"disabledColor" | "errorColor" | "infoColor" | "successColor" | "warningColor", string>) => {
    switch (status) {
    case `archive`:
    case `hidden`:
    case `draft`: return classes.disabledColor;
    case `rejected`: return classes.errorColor;
    case `attachment`: return classes.infoColor;
    case `published`: return classes.successColor;
    case `pending`: return classes.warningColor;
    }
};

interface ContentRow {
    id: string;
    name: string;
    authorName: string;
    authorId: string;
    description: string;
    keywords: string[];
    createdAt: Date;
    publishStatus: PublishStatus;
    updatedAt: Date;
    itemCount: number;
    contentType: ContentType;
    thumbnail: string;
}

interface Props {
}

export default function LibraryTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const prompt = usePrompt();
    const restApi = useRestAPI();
    const location = useLocation();
    const route = useRouteMatch();
    const currentOrganization = useCurrentOrganization();
    const [ selectedContent, setSelectedContent ] = useState<ContentItemDetails>();
    const [ selectedContentBulk, setSelectedContentBulk ] = useState<PublishedContentItem[]>();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ openDistributeDialog, setOpenDistributeDialog ] = useState(false);
    const [ openMoveDialog, setOpenMoveDialog ] = useState(false);
    const [ loadingGet, setLoadingGet ] = useState(false);
    const [ rows, setRows ] = useState<ContentRow[]>([]);
    const [ data, setData ] = useState<PublishedContentPayload>();
    const paths = location.pathname.replace(route.path, ``).split(`/`).filter((path) => !!path);
    const folderId = paths[paths.length - 1];
    const organizationId = currentOrganization?.id ?? ``;

    const getContentsFolders = async () => {
        setLoadingGet(true);
        try {
            const path = location.pathname.replace(route.path, ``);
            const resp = await restApi.getContentFolders({
                org_id: organizationId,
                page: 1,
                page_size: -1,
                path,
                content_type: [
                    ContentType.MATERIAL,
                    ContentType.PLAN,
                    ContentType.FOLDER,
                ],
            });
            setData(resp);
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: `superAdmin_contentFolderError`,
            }), {
                variant: `error`,
            });
        }
        setLoadingGet(false);
    };

    useEffect(() => {
        if (!currentOrganization) return;
        getContentsFolders();
    }, [ currentOrganization, location ]);

    useEffect(() => {
        const rows: ContentRow[] = data?.list.map((item) => ({
            id: item.id,
            authorId: item.author,
            authorName: item.author_name,
            createdAt: new Date(item.create_at * 1000),
            publishStatus: item.publish_status,
            description: item.description,
            name: item.name,
            keywords: item.keywords.filter((keyword) => !!keyword),
            updatedAt: new Date(item.update_at * 1000),
            itemCount: item.items_count,
            contentType: item.content_type,
            thumbnail: item.thumbnail,
        })) ?? [];
        setRows(rows);
    }, [ data ]);

    useEffect(() => {
        setOpenCreateDialog(false);
        setOpenEditDialog(false);
        setOpenDistributeDialog(false);
    }, [ route ]);

    const columns: TableColumn<ContentRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `superAdmin_nameLabel`,
            }),
            render: (row) => {
                if (row.contentType === ContentType.FOLDER) return <Link
                    className={clsx({
                        [classes.unclickableText]: loadingGet,
                    })}
                    href={`#${location.pathname}/${row.id}`}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                    >
                        <Badge
                            badgeContent={row.itemCount}
                            color="primary"
                            anchorOrigin={{
                                vertical: `top`,
                                horizontal: `left`,
                            }}
                        >
                            <img
                                alt="Folder icon"
                                className={classes.folderIcon}
                                src={FolderIcon}
                            />
                        </Badge>
                        {row.name}
                    </Box>
                </Link>;
                return <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <img
                        alt="Thumbail"
                        src={`v1/contents_resources/${row.thumbnail}`}
                        className={classes.itemThumbnail}
                        onError={handleError}
                    />
                    <span>{row.name}</span>
                </Box>;
            },
        },
        {
            id: `authorName`,
            label: intl.formatMessage({
                id: `superAdmin_authorNameLabel`,
            }),
        },
        {
            id: `contentType`,
            label: intl.formatMessage({
                id: `superAdmin_contentTypeLabel`,
            }),
            groups: [
                {
                    text: intl.formatMessage({
                        id: `superAdmin_libraryGroupsFolder`,
                    }),
                    value: ContentType.FOLDER,
                },
                {
                    text: intl.formatMessage({
                        id: `superAdmin_libraryGroupsLessonPlan`,
                    }),
                    value: ContentType.PLAN,
                },
                {
                    text: intl.formatMessage({
                        id: `superAdmin_libraryGroupsLessonMaterial`,
                    }),
                    value: ContentType.MATERIAL,
                },
            ],
            sort: (a: ContentType, b: ContentType) => {
                if (b === ContentType.FOLDER) return -1;
                if (a === ContentType.FOLDER) return 1;
                return a - b;
            },
            render: (row) => <span className={classes.contentTypeText}>{getContentTypeStr(row.contentType)}</span>,
        },
        {
            id: `authorId`,
            label: intl.formatMessage({
                id: `superAdmin_authorIdLabel`,
            }),
            hidden: true,
        },
        {
            id: `description`,
            label: intl.formatMessage({
                id: `superAdmin_descriptionLabel`,
            }),
        },
        {
            id: `keywords`,
            label: intl.formatMessage({
                id: `superAdmin_keywordsLabel`,
            }),
            render: (row) => row.keywords.map((keyword, i) => <Chip
                key={`keyword-${i}`}
                label={keyword}
                className={classes.keywordChip}
            />),
        },
        {
            id: `publishStatus`,
            label: intl.formatMessage({
                id: `superAdmin_publishStatusLabel`,
            }),
            render: (row) => <span
                className={clsx(classes.statusText, getPublishStatusColor(row.publishStatus, classes))}
            >
                {row.publishStatus}
            </span>,
        },
        {
            id: `createdAt`,
            label: intl.formatMessage({
                id: `superAdmin_createdLabel`,
            }),
            render: (row) => <span>{intl.formatDate(row.createdAt)}</span>,
        },
        {
            id: `updatedAt`,
            label: intl.formatMessage({
                id: `superAdmin_lastModifiedLabel`,
            }),
            render: (row) => <span>{intl.formatDate(row.updatedAt)}</span>,
        },
    ];

    const findContentByRow = (row: ContentRow) => data?.list.find((content) => content.id === row.id);

    const distributeSelectedRow = (row: ContentRow) => {
        const selectedContent = findContentByRow(row);
        if (!selectedContent) return;
        setSelectedContent(selectedContent);
        setOpenDistributeDialog(true);
    };

    const editSelectedRow = (row: ContentRow) => {
        const selectedContent = findContentByRow(row);
        if (!selectedContent) return;
        setSelectedContent(selectedContent);
        setOpenEditDialog(true);
    };

    const deleteSelectedRow = async (row: ContentRow) => {
        const selectedContent = findContentByRow(row);
        if (!selectedContent) return;
        const input = await prompt({
            title: intl.formatMessage({
                id: `superAdmin_deleteContentTitle`,
            }),
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${selectedContent.name}"`}?</DialogContentText>
                <DialogContentText><FormattedMessage id="superAdmin_type" /> <strong>{selectedContent.name}</strong> <FormattedMessage id="superAdmin_confirmDeletion" /></DialogContentText>
            </>,
            validations: [ validations.required(`Required`), validations.equals(selectedContent.name, `Input doesn't match the expected value`) ],
            variant: `error`,
        });
        if (input !== selectedContent.name) return;
        const { id, content_type } = selectedContent;
        try {
            if (content_type === ContentType.FOLDER)
                await restApi.deleteFoldersItemsById({
                    org_id: organizationId,
                    folder_id: id,
                });
            else if ([ ContentType.MATERIAL, ContentType.PLAN ].includes(content_type))
                await restApi.deleteContentsItemsById({
                    org_id: organizationId,
                    content_id: id,
                });
            else throw Error(`unknown-type`);
            getContentsFolders();
            enqueueSnackbar(intl.formatMessage({
                id: `superAdmin_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `superAdmin_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    const moveSelectedRow = (row: ContentRow) => {
        const selectedContent = findContentByRow(row);
        if (!selectedContent) return;
        setSelectedContentBulk([ selectedContent ]);
        setOpenMoveDialog(true);
    };

    const findContentById = (rowId: string) => data?.list.find((content) => content.id === rowId);

    const moveSelectedBulk = (rowIds: string[]) => {
        const selectedContentBulk = rowIds.map(findContentById).filter((c) => !!c) as PublishedContentItem[];
        if (!selectedContentBulk.length) return;
        setSelectedContentBulk(selectedContentBulk);
        setOpenMoveDialog(true);
    };

    return (
        <>
            <Paper className={classes.root}>
                <Breadcrumbs/>
                <Divider />
                <PageTable
                    rows={rows}
                    columns={columns}
                    idField="id"
                    loading={loadingGet}
                    orderBy="contentType"
                    groupBy="contentType"
                    secondaryActions={[
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_createFolderLabel`,
                            }),
                            icon: CreateNewFolderIcon,
                            onClick: () => setOpenCreateDialog(true),
                        },
                    ]}
                    selectActions={[
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_moveSelectedLabel`,
                            }),
                            icon: ExitToAppIcon,
                            onClick: (rowIds: string[]) => moveSelectedBulk(rowIds),
                        },
                    ]}
                    rowActions={(row) =>[
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_distributeLabel`,
                            }),
                            icon: ShareIcon,
                            disabled: row.contentType !== ContentType.FOLDER || paths.length > 0,
                            onClick: (row) => distributeSelectedRow(row),
                        },
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_moveLabel`,
                            }),
                            icon: ExitToAppIcon,
                            onClick: () => moveSelectedRow(row),
                        },
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: row.contentType !== ContentType.FOLDER,
                            onClick: (row) => editSelectedRow(row),
                        },
                        {
                            label: intl.formatMessage({
                                id: `superAdmin_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            onClick: (row) => deleteSelectedRow(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `superAdmin_libraryLabel`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `superAdmin_searchPlaceholder`,
                            }),
                        },
                    })}
                />
            </Paper>
            <CreateContentFolderDialog
                parentId={folderId}
                open={openCreateDialog}
                onClose={(value) => {
                    setOpenCreateDialog(false);
                    if (value) getContentsFolders();
                }}
            />
            <EditContentFolderDialog
                open={openEditDialog}
                value={selectedContent}
                onClose={(value) => {
                    setSelectedContent(undefined);
                    setOpenEditDialog(false);
                    if (value) getContentsFolders();
                }}
            />
            <DistributeContentFolderDialog
                open={openDistributeDialog}
                value={selectedContent}
                onClose={() => {
                    setSelectedContent(undefined);
                    setOpenDistributeDialog(false);
                }}
            />
            <MoveContentDialog
                open={openMoveDialog}
                value={selectedContentBulk}
                onClose={(hasUpdated) => {
                    setSelectedContentBulk(undefined);
                    setOpenMoveDialog(false);
                    if (hasUpdated) getContentsFolders();
                }}
            />
        </>
    );
}
