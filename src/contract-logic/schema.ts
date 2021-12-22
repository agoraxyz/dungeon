import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Enum from "./extensions/enum";
import Struct from "./extensions/struct";
import { borshPublicKey } from "./extensions/publicKey";

borshPublicKey();

export class Stat extends Struct {
    base: number;
    modifier: number;
};

export class CoreStats extends Struct {
    str: Stat;
    dex: Stat;
    con: Stat;
    int: Stat;
    wis: Stat;
    cha: Stat;
};

export class Stats extends Struct {
    core: CoreStats;
    att: Stat;
    ac: Stat;
    size: Stat;
    hp: number;
    xp: number;
};

export class Hero extends Struct {
    stats: Stats;
    xp: number;
    equipment: Artifact | null;
    hitpoints: number;
};

export class CreatureStack extends Struct {
    stats: Stats;
    creature: Creature;
    healthPool: number;
    stackSize: number;
    guarded: Guarded | null;
    damageType: DamageType;
};

export class Creature extends Enum {
    creatureSkeleton: CreatureSkeleton;
    creatureZombie: CreatureZombie;
    creatureMummy: CreatureMummy;
    creatureOrc: CreatureOrc;
    creatureGoblin: CreatureGoblin;
    creatureDwarf: CreatureDwarf;
    creatureCentaur: CreatureCentaur;
    creatureGriffin: CreatureGriffin;
    creatureElf: CreatureElf;
    creatureGenie: CreatureGenie;
    creatureMedusa: CreatureMedusa;
    creatureTroll: CreatureTroll;
    creatureWerewolf: CreatureWerewolf;
    creatureSphinx: CreatureSphinx;
    creatureUnicorn: CreatureUnicorn;
    creatureOgre: CreatureOgre;
    creatureBasilisk: CreatureBasilisk;
    creatureWyvern: CreatureWyvern;
    creatureCyclops: CreatureCyclops;
    creatureDragon: CreatureDragon;
};

export class CreatureSkeleton extends Struct {
};

export class CreatureZombie extends Struct {
};

export class CreatureMummy extends Struct {
};

export class CreatureOrc extends Struct {
};

export class CreatureGoblin extends Struct {
};

export class CreatureDwarf extends Struct {
};

export class CreatureCentaur extends Struct {
};

export class CreatureGriffin extends Struct {
};

export class CreatureElf extends Struct {
};

export class CreatureGenie extends Struct {
};

export class CreatureMedusa extends Struct {
};

export class CreatureTroll extends Struct {
};

export class CreatureWerewolf extends Struct {
};

export class CreatureSphinx extends Struct {
};

export class CreatureUnicorn extends Struct {
};

export class CreatureOgre extends Struct {
};

export class CreatureBasilisk extends Struct {
};

export class CreatureWyvern extends Struct {
};

export class CreatureCyclops extends Struct {
};

export class CreatureDragon extends Struct {
};

export class DamageType extends Enum {
    damageTypeBludgeoning: DamageTypeBludgeoning;
    damageTypePiercing: DamageTypePiercing;
    damageTypeSlashing: DamageTypeSlashing;
};

export class DamageTypeBludgeoning extends Struct {
};

export class DamageTypePiercing extends Struct {
};

export class DamageTypeSlashing extends Struct {
};

export class Damage extends Struct {
    ty: DamageType;
    dmg: number;
};

export class CombatLog extends Struct {
    attackerHp: number;
    defenderHp: number;
};

export class Action extends Enum {
    actionAttack: ActionAttack;
    actionInteract: ActionInteract;
    actionLadder: ActionLadder;
};

export class ActionAttack extends Struct {
    unnamed_0: CreatureStack;
};

export class ActionInteract extends Struct {
    unnamed_0: DungeonObject;
};

export class ActionLadder extends Struct {
};

export class Artifact extends Struct {
    id: number;
};

export class DungeonObject extends Enum {
    dungeonObjectArtifact: DungeonObjectArtifact;
    dungeonObjectExtraHealth: DungeonObjectExtraHealth;
};

export class DungeonObjectArtifact extends Struct {
    unnamed_0: Artifact;
};

export class DungeonObjectExtraHealth extends Struct {
    unnamed_0: number;
};

export class Guarded extends Enum {
    guardedObj: GuardedObj;
    guardedPassage: GuardedPassage;
    guardedLadder: GuardedLadder;
};

export class GuardedObj extends Struct {
    unnamed_0: DungeonObject;
};

export class GuardedPassage extends Struct {
};

export class GuardedLadder extends Struct {
};

export class DungeonState extends Struct {
    actionSpace: Map<number, Action>;
    combatLogs: CombatLog[];
    level: number;
    uncoveredActions: number;
};

export class InitializeHeroArgs extends Struct {
    heroOwnerPubkey: PublicKey;
    heroEditionNumber: BN;
};

export class DeleteGameArgs extends Struct {
    heroOwnerPubkey: PublicKey;
};

export class PerformActionArgs extends Struct {
    heroOwnerPubkey: PublicKey;
    actionId: number;
};

export class InitializeGameArgs extends Struct {
    heroOwnerPubkey: PublicKey;
};

export class Data extends Struct {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
};

export class Creator extends Struct {
    address: PublicKey;
    verified: boolean;
    share: number;
};

export class CreateMetadataAccountArgs extends Struct {
    data: Data;
    isMutable: boolean;
};

export const SCHEMA = new Map<any, any>([
    [
            Stat,
            {
                kind: 'struct', fields: [
			['base', 'u8'],
			['modifier', 'u8'],
                ],
            },
    ],
    [
            CoreStats,
            {
                kind: 'struct', fields: [
			['str', Stat],
			['dex', Stat],
			['con', Stat],
			['int', Stat],
			['wis', Stat],
			['cha', Stat],
                ],
            },
    ],
    [
            Stats,
            {
                kind: 'struct', fields: [
			['core', CoreStats],
			['att', Stat],
			['ac', Stat],
			['size', Stat],
			['hp', 'u16'],
			['xp', 'u16'],
                ],
            },
    ],
    [
            Hero,
            {
                kind: 'struct', fields: [
			['stats', Stats],
			['xp', 'u32'],
			['equipment', { kind: 'option', type: Artifact }],
			['hitpoints', 'u16'],
                ],
            },
    ],
    [
            CreatureStack,
            {
                kind: 'struct', fields: [
			['stats', Stats],
			['creature', Creature],
			['healthPool', 'u16'],
			['stackSize', 'u16'],
			['guarded', { kind: 'option', type: Guarded }],
			['damageType', DamageType],
                ],
            },
    ],
    [
            Creature,
            {
                kind: 'enum', field: 'enum', values: [
			['creatureSkeleton', CreatureSkeleton],
			['creatureZombie', CreatureZombie],
			['creatureMummy', CreatureMummy],
			['creatureOrc', CreatureOrc],
			['creatureGoblin', CreatureGoblin],
			['creatureDwarf', CreatureDwarf],
			['creatureCentaur', CreatureCentaur],
			['creatureGriffin', CreatureGriffin],
			['creatureElf', CreatureElf],
			['creatureGenie', CreatureGenie],
			['creatureMedusa', CreatureMedusa],
			['creatureTroll', CreatureTroll],
			['creatureWerewolf', CreatureWerewolf],
			['creatureSphinx', CreatureSphinx],
			['creatureUnicorn', CreatureUnicorn],
			['creatureOgre', CreatureOgre],
			['creatureBasilisk', CreatureBasilisk],
			['creatureWyvern', CreatureWyvern],
			['creatureCyclops', CreatureCyclops],
			['creatureDragon', CreatureDragon],
                ],
            },
    ],
    [
            CreatureSkeleton,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureZombie,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureMummy,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureOrc,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureGoblin,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureDwarf,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureCentaur,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureGriffin,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureElf,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureGenie,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureMedusa,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureTroll,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureWerewolf,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureSphinx,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureUnicorn,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureOgre,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureBasilisk,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureWyvern,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureCyclops,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            CreatureDragon,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            DamageType,
            {
                kind: 'enum', field: 'enum', values: [
			['damageTypeBludgeoning', DamageTypeBludgeoning],
			['damageTypePiercing', DamageTypePiercing],
			['damageTypeSlashing', DamageTypeSlashing],
                ],
            },
    ],
    [
            DamageTypeBludgeoning,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            DamageTypePiercing,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            DamageTypeSlashing,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            Damage,
            {
                kind: 'struct', fields: [
			['ty', DamageType],
			['dmg', 'u16'],
                ],
            },
    ],
    [
            CombatLog,
            {
                kind: 'struct', fields: [
			['attackerHp', 'u16'],
			['defenderHp', 'u16'],
                ],
            },
    ],
    [
            Action,
            {
                kind: 'enum', field: 'enum', values: [
			['actionAttack', ActionAttack],
			['actionInteract', ActionInteract],
			['actionLadder', ActionLadder],
                ],
            },
    ],
    [
            ActionAttack,
            {
                kind: 'struct', fields: [
			['unnamed_0', CreatureStack],
                ],
            },
    ],
    [
            ActionInteract,
            {
                kind: 'struct', fields: [
			['unnamed_0', DungeonObject],
                ],
            },
    ],
    [
            ActionLadder,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            Artifact,
            {
                kind: 'struct', fields: [
			['id', 'u8'],
                ],
            },
    ],
    [
            DungeonObject,
            {
                kind: 'enum', field: 'enum', values: [
			['dungeonObjectArtifact', DungeonObjectArtifact],
			['dungeonObjectExtraHealth', DungeonObjectExtraHealth],
                ],
            },
    ],
    [
            DungeonObjectArtifact,
            {
                kind: 'struct', fields: [
			['unnamed_0', Artifact],
                ],
            },
    ],
    [
            DungeonObjectExtraHealth,
            {
                kind: 'struct', fields: [
			['unnamed_0', 'u16'],
                ],
            },
    ],
    [
            Guarded,
            {
                kind: 'enum', field: 'enum', values: [
			['guardedObj', GuardedObj],
			['guardedPassage', GuardedPassage],
			['guardedLadder', GuardedLadder],
                ],
            },
    ],
    [
            GuardedObj,
            {
                kind: 'struct', fields: [
			['unnamed_0', DungeonObject],
                ],
            },
    ],
    [
            GuardedPassage,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            GuardedLadder,
            {
                kind: 'struct', fields: [
                ],
            },
    ],
    [
            DungeonState,
            {
                kind: 'struct', fields: [
			['actionSpace', { kind: 'map', key: 'u8', value: Action }],
			['combatLogs', [CombatLog]],
			['level', 'u8'],
			['uncoveredActions', 'u8'],
			,
                ],
            },
    ],
    [
            InitializeHeroArgs,
            {
                kind: 'struct', fields: [
			['heroOwnerPubkey', 'publicKey'],
			['heroEditionNumber', 'u64'],
                ],
            },
    ],
    [
            DeleteGameArgs,
            {
                kind: 'struct', fields: [
			['heroOwnerPubkey', 'publicKey'],
                ],
            },
    ],
    [
            PerformActionArgs,
            {
                kind: 'struct', fields: [
			['heroOwnerPubkey', 'publicKey'],
			['actionId', 'u8'],
                ],
            },
    ],
    [
            InitializeGameArgs,
            {
                kind: 'struct', fields: [
			['heroOwnerPubkey', 'publicKey'],
                ],
            },
    ],
    [
            Data,
            {
                kind: 'struct', fields: [
			['name', 'string'],
			['symbol', 'string'],
			['uri', 'string'],
			['sellerFeeBasisPoints', 'u16'],
			['creators', { kind: 'option', type: [Creator] }],
                ],
            },
    ],
    [
            Creator,
            {
                kind: 'struct', fields: [
			['address', 'publicKey'],
			['verified', 'u8'],
			['share', 'u8'],
                ],
            },
    ],
    [
            CreateMetadataAccountArgs,
            {
                kind: 'struct', fields: [
			['data', Data],
			['isMutable', 'u8'],
                ],
            },
    ],
]);
