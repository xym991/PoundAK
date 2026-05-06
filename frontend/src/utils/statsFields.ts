//use (=alias) for settings an alias example: "total_kills=kills"
// user (|condition) to specify a condition within the same data layer, example: "character_name|is_local:true"

export default [
  "kills|is_local:true",
  "deaths|is_local:true",
  "assists|is_local:true",
  "damage_dealt",
  "damage_block=damage taken",
  "total_heal=healing",
];

export const metaData = [
  "game_mode",
  "game_type",
  "map",
  "match_id",
  "match_outcome",
  "character_name|is_local:true",
];
