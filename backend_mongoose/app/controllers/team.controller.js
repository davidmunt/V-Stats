const asyncHandler = require("express-async-handler");
const Team = require("../models/team.model");
const League = require("../models/league.model");
const slugify = require("slugify");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const Match = require("../models/match.model");
const Set = require("../models/set.model");

// Crear Equipo
const createTeam = asyncHandler(async (req, res) => {
  // 1. Extraer los campos como los mandas en el JSON (id_league)
  const { name, id_league, id_venue, image, city } = req.body;

  // 2. Validar con los nuevos nombres
  if (!name || !id_league) {
    return res.status(400).json({ message: "Nombre y ID de Liga (slug) son obligatorios" });
  }

  // 3. Buscar la liga por SLUG (porque mandas "la-liga-2-...") y no por _id
  const league = await League.findOne({ slug: id_league, admin_id: req.userId });

  if (!league) {
    return res.status(403).json({ message: "No tienes permiso o la liga no existe" });
  }

  // 4. Crear el equipo usando el ID real de la liga encontrada
  const newTeam = await Team.create({
    name,
    league_id: league._id, // Usamos el ID de la base de datos
    image: image || "",
    city: city || "",
    id_venue: id_venue,
    admin_id: req.userId,
  });

  res.status(201).json({ team: await newTeam.toTeamResponse() });
});

// Obtener equipos de una liga
const getTeamsByLeague = asyncHandler(async (req, res) => {
  const { leagueSlug } = req.params;

  // 1. Encontrar la liga y validar propiedad
  const league = await League.findOne({ slug: leagueSlug });
  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada o no tienes acceso" });
  }

  // 2. Buscar equipos de esa liga
  const teams = await Team.find({ league_id: league._id, is_active: true }).exec();

  const teamsResponse = await Promise.all(teams.map(async (team) => await team.toTeamResponse()));

  res.status(200).json({ teams: teamsResponse });
});

// Obtener equipo por Slug
const getTeamBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const team = await Team.findOne({ slug, admin_id: req.userId, is_active: true }).exec();

  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  res.status(200).json({ team: await team.toTeamResponse() });
});

const getMyAssignedTeam = asyncHandler(async (req, res) => {
  let userProfile = null;

  // 1. Buscar al usuario según su rol para obtener el team_id
  if (req.userRole === "coach") {
    userProfile = await Coach.findById(req.userId).exec();
  } else if (req.userRole === "analyst") {
    userProfile = await Analyst.findById(req.userId).exec();
  }

  if (!userProfile || !userProfile.team_id) {
    return res.status(404).json({
      message: "No tienes un equipo asignado todavía. Contacta con tu administrador.",
    });
  }

  // 2. Buscar los detalles del equipo
  const team = await Team.findById(userProfile.team_id)
    .populate("league_id", "name slug") // Traemos info básica de la liga
    .exec();

  if (!team || !team.is_active) {
    return res.status(404).json({ message: "Equipo no encontrado o inactivo" });
  }

  res.status(200).json({
    team: await team.toTeamResponse(),
    role_in_team: req.userRole,
  });
});

// Actualizar Equipo (Simplificado)
const updateTeam = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;

  // 1. Buscamos el equipo
  const team = await Team.findOne({ slug });
  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  // --- LÓGICA PARA COACH ---
  // Si el campo id_coach viene en el body (puede ser un ID o null/undefined)
  if (updates.hasOwnProperty("id_coach")) {
    const newCoachId = updates.id_coach || null;

    // Si ha cambiado respecto a lo que había en la DB
    if (String(team.coach_id) !== String(newCoachId)) {
      // a. Si el equipo ya tenía un coach, le quitamos el equipo
      if (team.coach_id) {
        await Coach.findByIdAndUpdate(team.coach_id, { team_id: null });
      }
      // b. Si el nuevo valor es un ID, se lo asignamos al nuevo coach
      if (newCoachId) {
        await Coach.findByIdAndUpdate(newCoachId, { team_id: team._id });
      }
      // c. Actualizamos la referencia en el equipo
      team.coach_id = newCoachId;
    }
  }

  // --- LÓGICA PARA ANALYST ---
  if (updates.hasOwnProperty("id_analyst")) {
    const newAnalystId = updates.id_analyst || null;

    if (String(team.analyst_id) !== String(newAnalystId)) {
      // a. Si el equipo ya tenía un analista, le quitamos el equipo
      if (team.analyst_id) {
        await Analyst.findByIdAndUpdate(team.analyst_id, { team_id: null });
      }
      // b. Si el nuevo valor es un ID, se lo asignamos al nuevo analista
      if (newAnalystId) {
        await Analyst.findByIdAndUpdate(newAnalystId, { team_id: team._id });
      }
      // c. Actualizamos la referencia en el equipo
      team.analyst_id = newAnalystId;
    }
  }
  const allowedUpdates = ["name", "image", "city", "status", "is_active", "id_venue"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) team[key] = updates[key];
  });
  // Si cambia el nombre, regeneramos el slug
  if (updates.name) {
    team.slug = slugify(updates.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }
  await team.save();
  // Devolvemos el equipo populado para que el frontend tenga los datos actualizados
  const updatedTeam = await Team.findById(team._id).populate("coach_id", "name slug").populate("analyst_id", "name slug");
  res.status(200).json({ team: await updatedTeam.toTeamResponse() });
});

// Eliminar Equipo (Simplificado)
const deleteTeam = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Buscamos solo por slug para marcarlo como inactivo
  const team = await Team.findOneAndUpdate({ slug }, { is_active: false }, { new: true });

  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  res.status(200).json({ message: "Equipo eliminado correctamente" });
});

const assignCoach = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { email } = req.body;

  const team = await Team.findOne({ slug, admin_id: req.userId });
  if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

  const coach = await Coach.findOne({ email });
  if (!coach) return res.status(404).json({ message: "Entrenador no encontrado" });
  if (coach.team_id) return res.status(409).json({ message: "El entrenador ya tiene equipo" });

  coach.team_id = team._id;
  await coach.save();

  res.status(200).json({ message: "Entrenador asignado", coach: coach.name });
});

const assignAnalyst = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { email } = req.body;

  const team = await Team.findOne({ slug, admin_id: req.userId });
  if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

  const analyst = await Analyst.findOne({ email });
  if (!analyst) return res.status(404).json({ message: "Analista no encontrado" });
  if (analyst.team_id) return res.status(409).json({ message: "El analista ya tiene equipo" });

  analyst.team_id = team._id;
  await analyst.save();

  res.status(200).json({ message: "Analista asignado", analyst: analyst.name });
});

const getLeagueStandings = asyncHandler(async (req, res) => {
  const { leagueSlug } = req.params;
  // 1. Encontrar la liga
  const league = await League.findOne({ slug: leagueSlug, is_active: true });
  if (!league) return res.status(404).json({ message: "Liga no encontrada" });
  // 2. Obtener todos los equipos de la liga
  const teams = await Team.find({ league_id: league._id, is_active: true });
  // 3. Obtener todos los partidos finalizados de esta liga
  const matches = await Match.find({
    league_id: league._id,
    status: "finished",
    is_active: true,
  });
  // 4. Obtener todos los sets de esos partidos para calcular puntos totales
  const matchIds = matches.map((m) => m._id);
  const allSets = await Set.find({ match_id: { $in: matchIds }, status: "finished" });
  // 5. Calcular estadísticas por cada equipo
  const standings = teams.map((team) => {
    let stats = {
      id_team: team._id,
      slug: team.slug,
      name: team.name,
      image: team.image,
      played: 0,
      won: 0,
      lost: 0,
      points: 0, // Puntos de clasificación (3, 2, 1, 0)
      sets_won: 0,
      sets_lost: 0,
      points_favor: 0, // Puntos reales en los sets
      points_against: 0,
      points_diff: 0,
    };
    // Filtrar partidos donde participó este equipo
    const teamMatches = matches.filter((m) => m.local_team_id.equals(team._id) || m.visitor_team_id.equals(team._id));
    teamMatches.forEach((match) => {
      stats.played++;
      const isLocal = match.local_team_id.equals(team._id);
      // Obtener sets de este partido específico
      const matchSets = allSets.filter((s) => s.match_id.equals(match._id));
      let localSetsWon = 0;
      let visitorSetsWon = 0;
      matchSets.forEach((set) => {
        // Acumular puntos de sets (puntos a favor y contra)
        if (isLocal) {
          stats.points_favor += set.local_points;
          stats.points_against += set.visitor_points;
          if (set.local_points > set.visitor_points) localSetsWon++;
          else visitorSetsWon++;
        } else {
          stats.points_favor += set.visitor_points;
          stats.points_against += set.local_points;
          if (set.visitor_points > set.local_points) visitorSetsWon++;
          else localSetsWon++;
        }
      });
      // Determinar ganador del partido y puntos de liga
      if (isLocal) {
        stats.sets_won += localSetsWon;
        stats.sets_lost += visitorSetsWon;
        if (localSetsWon > visitorSetsWon) {
          stats.won++;
          // Sistema 3-0/3-1 (3pts) o 3-2 (2pts)
          stats.points += visitorSetsWon < 2 ? 3 : 2;
        } else {
          stats.lost++;
          // Sistema 2-3 (1pt) o 1-3/0-3 (0pts)
          stats.points += localSetsWon === 2 ? 1 : 0;
        }
      } else {
        stats.sets_won += visitorSetsWon;
        stats.sets_lost += localSetsWon;
        if (visitorSetsWon > localSetsWon) {
          stats.won++;
          stats.points += localSetsWon < 2 ? 3 : 2;
        } else {
          stats.lost++;
          stats.points += visitorSetsWon === 2 ? 1 : 0;
        }
      }
    });
    stats.points_diff = stats.points_favor - stats.points_against;
    return stats;
  });
  // 6. Ordenar: 1º Puntos Liga, 2º Diferencia de Puntos Sets
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.points_diff - a.points_diff;
  });
  res.status(200).json(standings);
});

module.exports = {
  createTeam,
  getTeamsByLeague,
  getTeamBySlug,
  getMyAssignedTeam,
  updateTeam,
  deleteTeam,
  assignCoach,
  assignAnalyst,
  getLeagueStandings,
};
