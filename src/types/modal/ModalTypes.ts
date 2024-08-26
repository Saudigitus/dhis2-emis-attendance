interface ImportContentProps {
    setOpen: (value: boolean) => void
    sectionName: string
    open: boolean
}

interface ApproveTranferProps {
    setOpen: (value: boolean) => void
    handleCloseApproval: () => void
}

interface ModalExportTemplateProps {
    setOpen: (value: boolean) => void
    sectionName: string
}

interface ModalProps {
    open: boolean
    title: string
    children: React.ReactNode
    setOpen: (value: boolean) => void
}


export type { ImportContentProps, ApproveTranferProps, ModalProps, ModalExportTemplateProps }