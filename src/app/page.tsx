"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";

/* ---------- Types ---------- */

interface PokemonSpecies {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
      };
    };
  };
  types: { type: { name: string } }[];
}

/* ---------- Config ---------- */

const LIMIT = 24;
const MAX_POKEMON = 1351;

/* ---------- Page ---------- */

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // กัน useEffect รันซ้ำตอน dev (Strict Mode)
  const fetchedRef = useRef(false);

  const fetchPokemon = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      /* 1️⃣ ดึง Pokémon species (ตัวหลักจริง ~1351 ตัว) */
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species?limit=${LIMIT}&offset=${offset}`
      );
      const speciesData = await speciesRes.json();

      /* 2️⃣ แปลง species → id → pokemon detail */
      const details: Pokemon[] = await Promise.all(
        speciesData.results.map(async (sp: PokemonSpecies) => {
          const id = Number(sp.url.split("/").filter(Boolean).pop());
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          return res.json();
        })
      );

      /* 3️⃣ รวมข้อมูล + กัน id ซ้ำ */
      setPokemonList((prev) => {
        const map = new Map<number, Pokemon>();
        [...prev, ...details].forEach((p) => map.set(p.id, p));
        return Array.from(map.values()).sort((a, b) => a.id - b.id);
      });

      setOffset((prev) => prev + LIMIT);

      if (!speciesData.next) {
        setHasMore(false); // ครบแล้ว
      }
    } catch (err) {
      console.error("Fetch Pokémon error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchPokemon();
  }, []);

  return (
<Container maxWidth="lg" sx={{ mt: 4, mb: 6, minHeight: "calc(100vh - 64px)" }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Pokémon Explorer
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
            สำรวจโปเกม่อนแบบแบ่งหน้า พร้อมดู ชื่อ รูป สถานะ ประเภท และวิวัฒนาการ
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {pokemonList.length === 0 && loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={`skeleton-${index}`}>
                <Card className="pokemon-card" sx={{ height: "100%", overflow: "hidden" }}>
                  <Skeleton variant="rectangular" height={210} sx={{ borderRadius: 3 }} />
                  <CardContent>
                    <Skeleton width="70%" />
                    <Skeleton width="40%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : pokemonList.map((pokemon) => {
              const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default;
              const frontDefault = pokemon.sprites.front_default;
              const githubArtwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
              const image = artwork || frontDefault || githubArtwork || "/images/no-image.png";

              return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={pokemon.id}>
                  <Card className="pokemon-card" sx={{ height: "100%" }}>
                    <CardActionArea component={Link} href={`/pokemon/${pokemon.name}`}>
                      <Box
                        sx={{
                          position: 'relative',
                          background: 'linear-gradient(180deg, rgba(255, 203, 5, 0.12) 0%, rgba(255, 255, 255, 1) 100%)',
                        }}
                      >
                        <img
                          src={image}
                          alt={pokemon.name}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: 180,
                            objectFit: 'contain',
                            padding: 12,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/no-image.png";
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.92)',
                            border: '2px solid var(--secondary)',
                          }}
                        />
                      </Box>

                      <CardContent sx={{ background: 'rgba(255,255,255,0.96)' }}>
                        <Typography align="center" sx={{ textTransform: "capitalize", fontWeight: 700, color: 'var(--foreground)' }}>
                          #{pokemon.id} {pokemon.name}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                          {pokemon.types.map((typeItem) => (
                            <Box key={typeItem.type.name} className="pokemon-chip">
                              {typeItem.type.name}
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {/* ---------- Loading ---------- */}
      {loading && pokemonList.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "var(--secondary)" }} />
        </Box>
      )}

      {/* ---------- Load more ---------- */}
      {!loading && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={fetchPokemon}
            sx={{ px: 4, py: 1.5, backgroundColor: "var(--primary)", color: "var(--foreground)", '&:hover': { backgroundColor: '#e6b504' } }}
          >
            โหลดเพิ่มเติม
          </Button>
        </Box>
      )}

      {!hasMore && (
        <Typography align="center" sx={{ mt: 4, color: "text.secondary" }}>
          โหลด Pokémon ครบทั้งหมดแล้ว
        </Typography>
      )}
    </Container>
  );
}