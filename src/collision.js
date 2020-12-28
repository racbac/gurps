/**
 * This roll20 API script attempts to automate Collisions and Falls rules (see B430).
 * To avoid dealing with HP/DR for immovable objects, we're assuming immovable objects are:
 * * non-breakable
 * * non-elastic
 */

/**
 * Calculate collision damage.
 * 
 * @param {Number} velocity Moving object's velocity.
 * @param {Object} object Object of moving object/character.
 * @param {Boolean} isTargetImmovable Whether the collided object is immovable.
 * @param {Boolean} isTargetHard Whether the collided object is hard.
 */
export function calcCollisionDamage(velocity, object, isTargetImmovable, isTargetHard) {
  /**
   * @todo How to query in API script.
   */
  let damage_type = query('?Damage Type|Crushing,cr|Piercing,pi|Cutting,cut|Impaling,imp');
  let damage_dice = getAttrByName((object.get('id'), 'hit_points', 'max') * (isTargetImmovable && isTargetHard) ? 2 : 1) * velocity / 100;

  if ('cr' !== damage_type) damage_dice /= 2;
  
  damage_dice = damage_dice < 0.25
    ? '1d-3'
    : damage_dice < 0.5
      ? '1d-2'
      : damage_dice < 1
        ? '1d-1'
        : `${Math.round(damage_dice)}d`;

  /**
   * @todo How to roll in script.
   */
  return roll(damage_dice);
}