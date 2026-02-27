import React from "react";
import { Box, Grid, Paper, Skeleton } from "@mui/material";

const PageSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width={220} height={42} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={320} height={26} sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Skeleton variant="text" width="70%" height={24} />
              <Skeleton variant="text" width="45%" height={42} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageSkeleton;
