import {
    localeState,
    useGlobalState,
} from "@kl-engineering/frontend-state";
import {
    ExpandMore as ExpandMoreIcon,
    Translate as LanguageIcon,
} from "@mui/icons-material";
import {
    Button,
    Menu,
    MenuItem,
    MenuProps,
    Theme,
    Tooltip,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
    withStyles,
} from '@mui/styles';
import clsx from "clsx";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    expand: {
        transform: `rotate(0deg)`,
        transition: theme.transitions.create(`transform`, {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: `rotate(180deg)`,
    },
    language: {
        margin: theme.spacing(0, 1),
        display: `block`,
    },
}));

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        anchorOrigin={{
            vertical: `bottom`,
            horizontal: `center`,
        }}
        transformOrigin={{
            vertical: `top`,
            horizontal: `center`,
        }}
        {...props}
    />
));

export interface LanguageSelectLocalization {
    select?: string;
    tooltip?: string;
}

export interface Language {
    code: string;
    text: string;
}

interface Props {
    languages: Language[];
    localization?: LanguageSelectLocalization;
    noIcon?: boolean;
}

export default function LanguageSelect (props: Props) {
    const { languages } = props;
    const classes = useStyles();
    const {
        localization,
        noIcon,
    } = props;

    const [ locale, setLocale ] = useGlobalState(localeState);
    const language = languages.find((language) => language.code === locale);
    const [ languageMenuElement, setLanguageMenuElement ] = useState<HTMLElement | null>(null);

    return(
        <>
            <Tooltip
                title={localization?.tooltip ?? `Change Language`}
                enterDelay={300}
            >
                <Button
                    color="inherit"
                    aria-owns={languageMenuElement ? `language-menu` : undefined}
                    aria-haspopup="true"
                    size="small"
                    onClick={(event) => setLanguageMenuElement(event.currentTarget)}
                >
                    {!noIcon && <LanguageIcon fontSize="inherit" />}
                    <span className={classes.language}>{language?.text ?? localization?.select ?? `Select Language`}</span>
                    <ExpandMoreIcon
                        fontSize="small"
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: languageMenuElement !== null,
                        })}
                    />
                </Button>
            </Tooltip>
            <StyledMenu
                keepMounted
                id="language-menu"
                anchorEl={languageMenuElement}
                open={Boolean(languageMenuElement)}
                onClose={() => setLanguageMenuElement(null)}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        selected={locale === language.code}
                        onClick={() => setLocale(language.code)}
                    >
                        {language.text}
                    </MenuItem>
                ))}
            </StyledMenu>
        </>
    );
}
