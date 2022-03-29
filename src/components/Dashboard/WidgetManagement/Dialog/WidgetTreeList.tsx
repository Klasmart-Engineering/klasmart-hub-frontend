import { WidgetType } from '../../models/widget.model';
import { Widgets } from '../defaultWidgets';
import {
    Folder,
    FolderOpen,
} from '@mui/icons-material';
import TreeItem,
{
    treeItemClasses,
    TreeItemProps,
} from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React,
{ useState } from "react";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        padding:theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: `var(--tree-view-color)`,
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: `inherit`,
            color: `inherit`,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));
type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelInfo?: string;
    labelText: string;
  };
function StyledTreeItem (props:StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{
                    display: `flex`,
                    alignItems: `center`,
                    p: 0.5,
                    pr: 0,
                    borderRadius:0,
                }}>
                    <Box
                        color="inherit"
                        sx={{
                            mr: 1,
                        }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: `inherit`,
                            flexGrow: 1,
                        }}
                    >
                        {labelText}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};
interface Props{
    updateWidget:any;
    widgets:any;
    availableWidgets:Widgets;
    defaultSelectedId:WidgetType;
}
export default function WidgetTree (props:Props) {
    const {
        updateWidget,
        widgets,
        availableWidgets,
        defaultSelectedId,
    } = props;
    const [ selectedItem, setSelectedItem ] = useState(defaultSelectedId);
    const handleClick = (widget: any) => {
        updateWidget(widget);
        setSelectedItem(widget.id);
    };
    const renderWidgetList = (widget:any) => (
        <StyledTreeItem
            key={`styledTreeItem`+widget.id}
            disabled = {availableWidgets[widget.id]?true:false}
            nodeId={widget.id}
            labelText={widget.name}
            onClick={() => handleClick(widget)}></StyledTreeItem>
    );
    return (
        <TreeView
            aria-label="Widgets"
            defaultExpanded={[ `3` ]}
            defaultSelected={defaultSelectedId}
            selected={ selectedItem }
            multiSelect={false}
            defaultCollapseIcon={<FolderOpen/>}
            defaultExpandIcon={<Folder/>}
            defaultEndIcon={<div style={{
                width: 24,
            }} />}
            sx={{
                height: 400,
                flexGrow: 1,
                maxWidth: 600,
                overflowY: `auto`,
            }}
        >
            {widgets.map((widget:any) => renderWidgetList(widget))}
        </TreeView>
    );
}
