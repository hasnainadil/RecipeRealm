import { Skeleton } from "@mui/material";
import { Stack } from "@mui/material";


export default function Skeleton_viewer() {
    return (
        <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />
            <Skeleton variant="rounded" animation="wave" width={210} height={60} />

        </Stack>
    )
}