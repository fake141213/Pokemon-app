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
  Skeleton,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid"; // ✅ Grid v2 (ถูกต้องกับ MUI v9)

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

/* ---------- Page ---------- */

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchedRef = useRef(false);

  const fetchPokemon = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // 1️⃣ ดึง species
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species?limit=${LIMIT}&offset=${offset}`
      );
      const speciesData = await speciesRes.json();

      // 2️⃣ ดึง detail
      const details: Pokemon[] = await Promise.all(
        speciesData.results.map(async (sp: PokemonSpecies) => {
          const id = Number(sp.url.split("/").filter(Boolean).pop());
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          return res.json();
        })
      );

      // 3️⃣ รวม + sort
      setPokemonList((prev) => {
        const map = new Map<number, Pokemon>();
        [...prev, ...details].forEach((p) => map.set(p.id, p));
        return Array.from(map.values()).sort((a, b) => a.id - b.id);
      });

      setOffset((prev) => prev + LIMIT);
      if (!speciesData.next) setHasMore(false);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* ---------- Header ---------- */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold" }}
        >
          Pokémon Explorer
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          สำรวจโปเกม่อนแบบแบ่งหน้า ดูชื่อ รูป และประเภท
        </Typography>
      </Box>

      {/* ---------- Grid ---------- */}
      <Grid container spacing={3}>
        {pokemonList.length === 0 && loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={`skeleton-${i}`}>
                <Card sx={{ height: "100%" }}>
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton width="70%" />
                    <Skeleton width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : pokemonList.map((pokemon) => {
              const artwork =
                pokemon.sprites.other?.["official-artwork"]?.front_default;
              const front = pokemon.sprites.front_default;
              const github = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

              const image = artwork || front || github || "/images/no-image.png";

              return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={pokemon.id}>
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea
                      component={Link}
                      href={`/pokemon/${pokemon.name}`}
                    >
                      <Box sx={{ p: 2 }}>
                        <img
                          src={image}
                          alt={pokemon.name}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: 160,
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/no-image.png";
                          }}
                        />
                      </Box>

                      <CardContent>
                        <Typography
                          align="center"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        >
                          #{pokemon.id} {pokemon.name}
                        </Typography>

                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {pokemon.types.map((t) => (
                            <Box
                              key={t.type.name}
                              sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: 12,
                                backgroundColor: "#eee",
                              }}
                            >
                              {t.type.name}
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
          <CircularProgress />
        </Box>
      )}

      {/* ---------- Load more ---------- */}
      {!loading && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" onClick={fetchPokemon}>
            โหลดเพิ่มเติม
          </Button>
        </Box>
      )}

      {!hasMore && (
        <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
          โหลด Pokémon ครบทั้งหมดแล้ว
        </Typography>
      )}
    </Container>
  );
}