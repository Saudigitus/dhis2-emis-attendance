import React from 'react'
import style from "./badge.module.css"

interface BadgeProps {
    value: string
}

export default function Badge({ value }: BadgeProps): React.ReactElement {
    return (
        <span className={style.BadgeContainer}>{value}</span>
    )
}
