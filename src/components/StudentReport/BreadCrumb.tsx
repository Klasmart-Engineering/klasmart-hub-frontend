import React from "react";
import { Breadcrumbs, Link } from "@mui/material";

interface LinkModel {
    label: string,
    href: string
}

interface Props {
    links: LinkModel[]
};

export default function Breadcrumb({ links }: Props) {
    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
                {links.map(({ label, href }, index) =>
                    <Link underline="hover" color="inherit" key={index} href={href}>
                        {label}
                    </Link>
                )}
            </Breadcrumbs>
        </div>
    );
}