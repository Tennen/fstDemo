/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTHOR_NAME: string
    readonly VITE_CONTACT_EMAIL: string
    readonly VITE_GITHUB_URL: string
    readonly VITE_PROJECT_NAME: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}