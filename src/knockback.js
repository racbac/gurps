/**
 * Knockback.js
 * 
 * Roll20 script to implement knockback, see B378.
 */

/**
 * Calculate knockback yards.
 * 
 * @param {Number} basic_damage Damage before subtracting DR.
 * @param {Object} target Object of character suffering knockback.
 */
export function calcYards(basic_damage, target) {
  const target_id = target.get('id');
  const target_st = getAttrByName(target_id, 'strength');

  return target_st === 0
    ? Math.floor(getAttrByName(target_id, 'health'))
    : target_st <= 3
      ? basic_damage
      : Math.floor(basic_damage / (target_st - 2));
}

/**
 * Determine whether knockback target falls down.
 * 
 * @param {Number} yards Yards of knockback.
 * @param {Object} target Character suffering knockback
 */
export function calcFallsDown(yards, target) {
  let modifier = yards > 1
    ? 1 - yards
    : 0;

  const hasPerfectBalance = filterObjs(obj => {
    return obj.get('type') === 'attribute'
      && obj.get('characterid') === target.get('id')
      && obj.name.test(/^repeating_skills_\w+name$/)
      && obj.current == 'Perfect Balance';
  }).length > 0;

  if (hasPerfectBalance) modifier += 4;

  const saveSkills = filterObjs(obj => {
    return obj.get('type') === 'attribute'
      && obj.get('characterid') === target.get('id')
      && obj.name.test(/^repeating_skills_\w+name$/) && ['Judo', 'Acrobatics'].includes(obj.current);
  }).map(({current}) => current);

  const dx = getAttrByName(target.get('id'), 'dexterity');
  const saveRoll = Math.max(...saveSkills, dx);

  /**
   * @todo How to roll in a script?
   */
  return roll('3d6') <= saveRoll + modifier;
}