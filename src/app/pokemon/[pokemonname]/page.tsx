"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";

interface PokemonDetail {
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
  stats: { base_stat: number; stat: { name: string } }[];
}

interface SpeciesResponse {
  evolution_chain: { url: string };
}

interface EvolutionChain {
  chain: EvolutionNode;
}

interface EvolutionNode {
  species: { name: string };
  evolves_to: EvolutionNode[];
}

const getPokemonImage = (pokemon: PokemonDetail) => {
  const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const frontDefault = pokemon.sprites.front_default;
  const githubArtwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  return artwork || frontDefault || githubArtwork || "/images/no-image.png";
};

const getCryUrl = (name: string) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `https://play.pokemonshowdown.com/audio/cries/${slug}.mp3`;
};

const extractEvolutionChain = (node?: EvolutionNode | null): string[] => {
  if (!node) return [];
  const list: string[] = [];
  const walk = (current: EvolutionNode | null) => {
    if (!current) return;
    list.push(current.species.name);
    if (current.evolves_to?.length) {
      walk(current.evolves_to[0]);
    }
  };
  walk(node);
  return list;
};

export default function PokemonPage({ params }: { params: Promise<{ pokemonname: string }> }) {
  const currentParams = use(params);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolution, setEvolution] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioError, setAudioError] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const name = currentParams.pokemonname.toLowerCase();
    let canceled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`),
        ]);

        if (!pokemonRes.ok || !speciesRes.ok) {
          throw new Error("Pokemon not found");
        }

        const pokemonData: PokemonDetail = await pokemonRes.json();
        const speciesData: SpeciesResponse = await speciesRes.json();
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData: EvolutionChain = await evolutionRes.json();

        if (!canceled) {
          setPokemon(pokemonData);
          setEvolution(extractEvolutionChain(evolutionData.chain));
        }
      } catch (error) {
        if (!canceled) {
          console.error("Failed to load Pokémon detail:", error);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      canceled = true;
    };
  }, [currentParams.pokemonname]);

  const playSound = async () => {
    if (!pokemon) return;

    const url = getCryUrl(pokemon.name);
    const audio = new Audio(url);

    setAudioError(false);
    setPlaying(true);

    audio.onended = () => setPlaying(false);
    audio.onerror = () => {
      setAudioError(true);
      setPlaying(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(`This is ${pokemon.name}`);
        window.speechSynthesis.speak(utterance);
      }
    };

    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setAudioError(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(`This is ${pokemon.name}`);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6, minHeight: "calc(100vh - 64px)" }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--foreground)" }}>
            Pokémon Detail
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            ดูชื่อ รูป สถานะ ประเภท วิวัฒนาการ และเล่นเสียงโปเกม่อนได้ในหน้ารายละเอียดนี้
          </Typography>
        </Box>
        <Button component={Link} href="/" variant="contained" sx={{ backgroundColor: "var(--secondary)", color: "#ffffff", '&:hover': { backgroundColor: '#225fa3' } }}>
          กลับสู่หน้ารายการ
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="pokemon-card" sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
                <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={42} sx={{ mt: 2, borderRadius: 3 }} />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card className="pokemon-card" sx={{ p: 3 }}>
                <Skeleton variant="text" height={34} width="35%" />
                <Skeleton variant="rectangular" height={40} sx={{ mt: 1, borderRadius: 3 }} />
                <Skeleton variant="text" height={34} width="35%" sx={{ mt: 3 }} />
                <Skeleton variant="rectangular" height={120} sx={{ mt: 1, borderRadius: 3 }} />
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {!loading && pokemon && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="pokemon-card">
              <Box sx={{ p: 3, textAlign: "center" }}>
                <img
                  src={getPokemonImage(pokemon)}
                  alt={pokemon.name}
                  style={{ width: "100%", maxHeight: 320, objectFit: "contain" }}
                  onError={(event) => {
                    event.currentTarget.src = "/images/no-image.png";
                  }}
                />
                <Typography variant="h5" sx={{ mt: 2, textTransform: "capitalize", fontWeight: 800, color: "var(--foreground)" }}>
                  {pokemon.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  #{pokemon.id}
                </Typography>
                <Button variant="contained" onClick={playSound} disabled={playing} sx={{ backgroundColor: "var(--primary)", color: "var(--foreground)", '&:hover': { backgroundColor: '#e6b504' } }}>
                  {playing ? "กำลังเล่นเสียง..." : "เล่นเสียงโปเกม่อน"}
                </Button>
                {audioError && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    ไม่พบเสียงตรงนี้, ใช้เสียงสังเคราะห์แทน
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 3, p: 3, borderRadius: 3, background: 'var(--surface)', border: '1px solid rgba(42, 117, 187, 0.16)' }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
                ประเภท
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {pokemon.types.map((item) => (
                  <Chip
                    key={item.type.name}
                    label={item.type.name}
                    sx={{
                      textTransform: "capitalize",
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      fontWeight: 700,
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'grid', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
                สถานะ
              </Typography>
              <Grid container spacing={2}>
                {pokemon.stats.map((stat) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={stat.stat.name}>
                    <Card className="pokemon-card" sx={{ p: 2, height: "100%" }}>
                      <Typography sx={{ textTransform: "capitalize", fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
                        {stat.stat.name}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--secondary)" }}>
                        {stat.base_stat}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ p: 3, borderRadius: 3, background: 'var(--surface)', border: '1px solid rgba(42, 117, 187, 0.16)' }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "var(--foreground)" }}>
                วิวัฒนาการ
              </Typography>
              {evolution.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: 'center' }}>
                  {evolution.map((name, index) => (
                    <Box key={name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip label={name} sx={{ textTransform: "capitalize", backgroundColor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }} />
                      {index < evolution.length - 1 && <Typography sx={{ color: '#475569' }}>→</Typography>}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">ไม่พบข้อมูลวิวัฒนาการ</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
