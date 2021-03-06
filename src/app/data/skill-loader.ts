import { BackpackLoader } from '../models/skills/backpack';
import { BeaconLoader } from '../models/skills/beacon';
import { BehaviorLoader } from '../models/skills/behavior';
import { ControlLoader } from '../models/skills/control';
import { DamageLoader } from '../models/skills/damage';
import { FireLoader } from '../models/skills/fire';
import { HealLoader } from '../models/skills/heal';
import { KnockbackLoader } from '../models/skills/knockback';
import { LifeLoader } from '../models/skills/life';
import { LightningLoader } from '../models/skills/lightning';
import { PickupLoader } from '../models/skills/pickup';
import { PoisonLoader } from '../models/skills/poison';
import { RangedLoader } from '../models/skills/ranged';
import { RideLoader } from '../models/skills/ride';
import { ShieldLoader } from '../models/skills/shield';
import { SlowLoader } from '../models/skills/slow';
import { SprintLoader } from '../models/skills/sprint';
import { StompLoader } from '../models/skills/stomp';
import { ThornsLoader } from '../models/skills/thorns';
import { WitherLoader } from '../models/skills/wither';

export const SkillLoader = {
  Backpack: BackpackLoader,
  Beacon: BeaconLoader,
  Behavior: BehaviorLoader,
  Control: ControlLoader,
  Damage: DamageLoader,
  Fire: FireLoader,
  Heal: HealLoader,
  Life: LifeLoader,
  Knockback: KnockbackLoader,
  Lightning: LightningLoader,
  Pickup: PickupLoader,
  Poison: PoisonLoader,
  Ranged: RangedLoader,
  Ride: RideLoader,
  Shield: ShieldLoader,
  Slow: SlowLoader,
  Sprint: SprintLoader,
  Stomp: StompLoader,
  Thorns: ThornsLoader,
  Wither: WitherLoader,
};
