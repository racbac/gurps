import { calcCollisionDamage } from "./collision";

function injury(type, ...args) {
  switch (type) {
    case 'Collision':
      return calcCollisionDamage(...args);
  }
}

export default injury;