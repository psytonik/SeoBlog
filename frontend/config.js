import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig();
export const API = publicRuntimeConfig.API_DEVELOPMENT;

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.DOMAIN_DEVELOPMENT;

export const config = { amp: true };
