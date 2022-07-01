const { loadBrandingOptions } = require(`@kl-engineering/kidsloop-branding`);

const brandingOptions = loadBrandingOptions(process.env.BRAND);

export const tabTitle = (pageName: string) => {
    document.title = `${brandingOptions.company.name} | Interactive Digital Platform for Education | ${pageName}`;
};
