"use client";

import { Box, Button, Card, Container, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6, minHeight: "calc(100vh - 64px)" }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--foreground)" }}>
          เกี่ยวกับโปรเจกต์ Pokémon Explorer
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720, mx: "auto" }}>
          เว็บนี้เป็นตัวอย่างการใช้งาน Next.js ร่วมกับ MUI และ PokeAPI เพื่อแสดงโปเกม่อนแบบแบ่งหน้า พร้อมหน้ารายละเอียดและข้อมูลวิวัฒนาการ
        </Typography>
      </Box>

      <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)", background: 'var(--surface)' }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
              ผู้พัฒนา
            </Typography>
            <Typography color="text.secondary">Jakkraphong Samransit</Typography>
            <Typography color="text.secondary">รหัสนักศึกษา 673450032-2</Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
              รายวิชา
            </Typography>
            <Typography color="text.secondary">Front-end Web Programming IN403101</Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
              หลักสูตร
            </Typography>
            <Typography color="text.secondary">Computer and Information Science</Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
              สถาบันการศึกษา
            </Typography>
            <Typography color="text.secondary">Khon Kaen University</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
                แหล่งที่มา
              </Typography>
              <Typography color="text.secondary">ใช้ข้อมูลจาก PokeAPI และภาพโปเกม่อนจาก GitHub Sprite Repository</Typography>
            </Box>
            <Button
              component="a"
              href="https://github.com/fake141213/Pokemon-app.git"
              target="_blank"
              rel="noreferrer"
              variant="contained"
              sx={{ backgroundColor: 'var(--secondary)', color: '#ffffff', '&:hover': { backgroundColor: '#225fa3' } }}
            >
              View Source Code
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
