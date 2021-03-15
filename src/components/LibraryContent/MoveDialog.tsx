import {
    ContentType,
    FolderFileType,
    useRestAPI,
} from "@/api/restapi";
import FolderIcon from "@/assets/img/folder.svg";
import { currentMembershipVar } from "@/cache";
import { PublishedContentItem } from "@/types/objectTypes";
import { useReactiveVar } from "@apollo/client";
import {
    Badge,
    Box,
    CircularProgress,
    createStyles,
    fade,
    makeStyles,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Check as CheckIcon,
    Home as HomeIcon,
    OpenWith as OpenWithIcon,
    Remove as RemoveIcon,
} from "@material-ui/icons";
import {
    TreeItem,
    TreeView,
} from "@material-ui/lab";
import clsx from "clsx";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

export interface Folder {
    details?: PublishedContentItem;
    files: Map<string, Folder>;
}

const ROOT = `root`;

const getFolderFileTypeStr = (type: ContentType) => {
    switch (type) {
    case ContentType.FOLDER: return FolderFileType.FOLDER;
    case ContentType.MATERIAL:
    case ContentType.PLAN: return FolderFileType.CONTENT;
    }
};

const useStyles = makeStyles((theme) => createStyles({
    treeItemRoot: {
        "& .MuiTreeItem-label": {
            borderRadius: theme.spacing(2),
        },
        "& .MuiBadge-badge": {
            fontSize: `0.5rem`,
            padding: theme.spacing(2/8),
        },
        "& .": {
            pointerEvents: `none`,
        },
    },
    treeItemLabel: {
        padding: theme.spacing(0.5, 0.5, 0.5, 1),
    },
    disabledClickArea: {
        pointerEvents: `none`,
    },
    enabledClickArea: {
        pointerEvents: `auto`,
    },
    disabledText: {
        color: fade(theme.palette.common.black, 0.33),
    },
    enabledText: {
        color: `initial`,
    },
    selectedText: {
        fontWeight: 600,
    },
    disabledFolderIcon: {
        opacity: 0.5,
    },
    folderIcon: {
        width: 24,
        height: 18,
        marginRight: theme.spacing(1),
    },
    currentFolder: {
        fontStyle: `italic`,
    },
}));

interface Props {
    value?: PublishedContentItem[];
    open: boolean;
    onClose: (hasUpdated?: boolean) => void;
}

export default function MoveContentDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ selectedNodeId, setSelectedNodeId ] = useState<string>();
    const [ folderStructure, setFolderStructure ] = useState<Folder>();

    const title = value ? (value?.length === 1 ? `Move "${value?.[0].name }"` : `Move ${value?.length} items`) : `Move`;

    const paths = value?.[0].dir_path?.split(`/`).filter((path) => !!path) ?? [];
    const parentIds = paths.length ? paths : [ ROOT ];

    const FolderTreeItem = (folder: Folder) => {
        const id = folder.details?.id ?? ROOT;
        const isSelected = id === selectedNodeId;
        const isParentFolder = parentIds[parentIds.length - 1] === id;
        const isDisabled = !!value?.find((v) => v.id === folder.details?.id || isParentFolder || !!folder.details?.dir_path?.includes(v.id));
        const folderArr = Array.from(folder.files);
        folderArr.sort(([ , a ], [ , b ]) => a.details?.name.localeCompare(b.details?.name ?? ``) ?? 0);
        return <TreeItem
            key={id}
            className={clsx(classes.treeItemRoot, {
                [classes.enabledClickArea]: !isDisabled,
                [classes.disabledClickArea]: isDisabled,
                [classes.enabledText]: !isDisabled,
                [classes.disabledText]: isDisabled,
            })}
            nodeId={id}
            label={<Box
                display="flex"
                alignItems="center"
                className={classes.treeItemLabel}
            >
                <Badge
                    badgeContent={folder.details?.items_count}
                    color="primary"
                    className={clsx({
                        [classes.disabledFolderIcon]: isDisabled,
                    })}
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
                {id === ROOT
                    ? <HomeIcon />
                    : <Typography
                        className={clsx({
                            [classes.selectedText]: isSelected,
                        })}
                    >
                        {folder.details?.name}
                    </Typography>
                }
                <Box flex="1" />
                {isParentFolder && <Typography className={clsx(classes.currentFolder, classes.disabledText)}>Current folder</Typography>}
                {isDisabled && !isParentFolder &&
                    <Tooltip title={intl.formatMessage({
                        id: `library_moveTooltip`,
                    })}>
                        <OpenWithIcon
                            color="disabled"
                            style={{
                                pointerEvents: `auto`,
                                cursor: `default`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Tooltip>
                }
                {isSelected &&
                    <Tooltip title={intl.formatMessage({
                        id: `library_destinationTooltip`,
                    })}>
                        <CheckIcon color="primary" />
                    </Tooltip>
                }
            </Box>}
        >
            {folderArr.map(([ , f ]) => FolderTreeItem(f))}
        </TreeItem>;
    };

    const addPathsToStructure = (parentFolder: Folder, paths: string[], content: PublishedContentItem) => {
        const path = paths[0] ?? content.id;
        const folder = parentFolder.files.get(path) ?? {
            files: new Map<string, Folder>(),
        };
        folder.details = !paths.length ? content : undefined;
        parentFolder.files.set(path, folder);
        if (!paths.length) return;
        addPathsToStructure(folder, paths.slice(1), content);
    };

    const getFolderStructure = async () => {
        const folderStructure = {
            files: new Map<string, Folder>(),
        };
        if (!open) return;
        const content = await restApi.getFolderStructure({
            org_id: organization_id,
        });

        // Sorting (to have items closer to the root last, deeper first)
        // fixes a stackoverflow bug. Rendering FolderTreeItem mapped items
        // built up in a random order could crash (white screen) the website.
        // Probable cause is the structure built up by addPathsToStructure.
        content.items.sort((a, b) => b.dir_path.length - a.dir_path.length);

        for (const contentItem of content.items) {
            const paths = Array.from([ ...new Set(contentItem.dir_path?.split(`/`)) ]);
            addPathsToStructure(folderStructure, paths, contentItem);
        }
        setFolderStructure(folderStructure);
    };

    const handleMoveContent = async () => {
        try {
            const folderInfo = value?.map((content) => ({
                id: content.id,
                folder_file_type: getFolderFileTypeStr(content.content_type),
            })) ?? [];
            await restApi.putFoldersItemsBulkMove({
                dist: (selectedNodeId !== ROOT ? selectedNodeId : `/`) ?? ``,
                org_id: organization_id,
                folder_info: folderInfo,
            });
            onClose(true);
            enqueueSnackbar(intl.formatMessage({
                id: `library_moveSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `library_moveError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleNodeSelect = (event: React.ChangeEvent<{}>, nodeId: string) => {
        setSelectedNodeId(nodeId);
    };

    useEffect(() => {
        if (!open) return;
        getFolderStructure();
        setSelectedNodeId(undefined);
        setFolderStructure(undefined);
    }, [ open ]);

    return (
        <>
            <Dialog
                open={open}
                title={title}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `library_cancelLabel`,
                        }),
                        color: `primary`,
                        onClick: () => onClose(),
                    },
                    {
                        label: intl.formatMessage({
                            id: `library_moveLabel`,
                        }),
                        color: `primary`,
                        disabled: !selectedNodeId,
                        onClick: handleMoveContent,
                    },
                ]}
                onClose={() => onClose()}
            >
                {folderStructure
                    ? <TreeView
                        key={parentIds.toString()}
                        defaultExpanded={[ ROOT, ...parentIds ]}
                        defaultCollapseIcon={<RemoveIcon />}
                        defaultExpandIcon={<AddIcon />}
                        onNodeSelect={handleNodeSelect}
                    >
                        {Array.from(folderStructure.files).map(([ , folder ]) => FolderTreeItem(folder))}
                    </TreeView>
                    : <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <CircularProgress />
                    </Box>
                }
            </Dialog>
        </>
    );
}
