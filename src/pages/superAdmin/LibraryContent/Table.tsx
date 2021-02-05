import {
    ContentType,
    getContentTypeStr,
    useRestAPI,
} from "@/api/restapi";
import FolderIcon from "@/assets/img/folder.svg";
import { currentMembershipVar } from "@/cache";
import Breadcrumbs from "@/components/LibraryContent/Breadcrumbs";
import CreateContentFolderDialog from "@/components/LibraryContent/Folder/Dialog/Create";
import EditContentFolderDialog from "@/components/LibraryContent/Folder/Dialog/Edit";
import ShareContentFolderDialog from "@/components/LibraryContent/Folder/ShareDialog";
import MoveContentDialog from "@/components/LibraryContent/MoveDialog";
import globalCss from "@/globalCss";
import {
    ContentItemDetails,
    PublishedContentItem,
    PublishedContentPayload,
    PublishStatus,
} from "@/types/objectTypes";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client";
import {
    Badge,
    Box,
    Chip,
    createStyles,
    DialogContentText,
    Divider,
    Link,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    CreateNewFolder as CreateNewFolderIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExitToApp as ExitToAppIcon,
    Share as ShareIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    Table,
    usePrompt,
    useSnackbar,
    utils,
    validations,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
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
    } = globalCss(theme);
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

enum ContentGroup {
    FOLDER = `Folder`,
    CONTENT = `Lesson Material / Plan`,
    UNKNOWN = `Unknown`,
}

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
    const { enqueueSnackbar } = useSnackbar();
    const prompt = usePrompt();
    const intl = useIntl();
    const restApi = useRestAPI();
    const location = useLocation();
    const route = useRouteMatch();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ selectedContent, setSelectedContent ] = useState<ContentItemDetails>();
    const [ selectedContentBulk, setSelectedContentBulk ] = useState<PublishedContentItem[]>();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ openShareDialog, setOpenShareDialog ] = useState(false);
    const [ openMoveDialog, setOpenMoveDialog ] = useState(false);
    const [ loadingGet, setLoadingGet ] = useState(false);
    const [ rows, setRows ] = useState<ContentRow[]>([]);
    const [ data, setData ] = useState<PublishedContentPayload>();
    const paths = location.pathname.replace(route.path, ``).split(`/`).filter((path) => !!path);
    const folderId = paths[paths.length - 1];

    const getContentsFolders = async () => {
        setLoadingGet(true);
        try {
            const path = location.pathname.replace(route.path, ``);
            const resp = await restApi.getContentFolders({
                org_id: organization_id,
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
            enqueueSnackbar(`Sorry, something went wrong`, {
                variant: `error`,
            });
        }
        setLoadingGet(false);
    };

    useEffect(() => {
        if (!organization_id) return;
        getContentsFolders();
    }, [ organization_id, location ]);

    useEffect(() => {
        const rows: ContentRow[] = data?.list.map((item) => ({
            id: item.id,
            authorId: item.author,
            authorName: item.author_name,
            createdAt: new Date(item.create_at * 1000),
            publishStatus: item.publish_status,
            description: item.description,
            name: item.name,
            keywords: item.keywords.split(`,`).filter((keyword) => !!keyword),
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
        setOpenShareDialog(false);
    }, [ route ]);

    const columns: TableColumn<ContentRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
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
                    />
                    <span>{row.name}</span>
                </Box>;
            },
        },
        {
            id: `authorName`,
            label: `Author Name`,
        },
        {
            id: `contentType`,
            label: `Content Type`,
            groupText: (rowValue) => {
                switch (rowValue) {
                case ContentType.FOLDER: return ContentGroup.FOLDER;
                case ContentType.MATERIAL:
                case ContentType.PLAN: return ContentGroup.CONTENT;
                }
                return ContentGroup.UNKNOWN;
            },
            groups: [
                {
                    text: ContentGroup.FOLDER,
                },
                {
                    text: ContentGroup.CONTENT,
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
            label: `Author ID`,
            hidden: true,
        },
        {
            id: `description`,
            label: `Description`,
        },
        {
            id: `keywords`,
            label: `Keywords`,
            render: (row) => row.keywords.map((keyword, i) => <Chip
                key={`keyword-${i}`}
                label={keyword}
                className={classes.keywordChip}
            />),
        },
        {
            id: `publishStatus`,
            label: `Publish Status`,
            render: (row) => <span
                className={clsx(classes.statusText, getPublishStatusColor(row.publishStatus, classes))}
            >
                {row.publishStatus}
            </span>,
        },
        {
            id: `createdAt`,
            label: `Created`,
            render: (row) => <span>{intl.formatDate(row.createdAt)}</span>,
        },
        {
            id: `updatedAt`,
            label: `Last Modified`,
            render: (row) => <span>{intl.formatDate(row.updatedAt)}</span>,
        },
    ];

    const findContentByRow = (row: ContentRow) => data?.list.find((content) => content.id === row.id);

    const shareSelectedRow = (row: ContentRow) => {
        const selectedContent = findContentByRow(row);
        if (!selectedContent) return;
        setSelectedContent(selectedContent);
        setOpenShareDialog(true);
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
            title: `Delete Content`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${selectedContent.name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{selectedContent.name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ validations.required(`Required`), validations.equals(selectedContent.name, `Input doesn't match the expected value`) ],
            variant: `error`,
        });
        if (input !== selectedContent.name) return;
        const { id } = selectedContent;
        try {
            await restApi.deleteFoldersItemsById({
                org_id: organization_id,
                content_id: id,
            });
            getContentsFolders();
            enqueueSnackbar(`Content has been deleted succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
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
                <Table
                    rows={rows}
                    columns={columns}
                    idField="id"
                    loading={loadingGet}
                    orderBy="contentType"
                    groupBy="contentType"
                    secondaryActions={[
                        {
                            label: `Create Folder`,
                            icon: CreateNewFolderIcon,
                            onClick: () => setOpenCreateDialog(true),
                        },
                    ]}
                    selectActions={[
                        {
                            label: `Move Selected`,
                            icon: ExitToAppIcon,
                            onClick: (rowIds: string[]) => moveSelectedBulk(rowIds),
                        },
                    ]}
                    rowActions={(row) =>[
                        {
                            label: `Share`,
                            icon: ShareIcon,
                            disabled: row.contentType !== ContentType.FOLDER || paths.length > 0,
                            onClick: (row) => shareSelectedRow(row),
                        },
                        {
                            label: `Move`,
                            icon: ExitToAppIcon,
                            onClick: () => moveSelectedRow(row),
                        },
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            disabled: row.contentType !== ContentType.FOLDER,
                            onClick: (row) => editSelectedRow(row),
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            onClick: (row) => deleteSelectedRow(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Library`,
                        },
                        search: {
                            placeholder: `Search for content by folder names, author, author ID and keywords`,
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
            <ShareContentFolderDialog
                open={openShareDialog}
                value={selectedContent}
                onClose={() => {
                    setSelectedContent(undefined);
                    setOpenShareDialog(false);
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
