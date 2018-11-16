import { MonsterPresets } from '../src/world/Presets';

export const monsterPresets: MonsterPresets = {
    "bee": {
        "name": "Bee",
        "image": "bee",
        "palette": null,
        "movement": {
            "interval": 2,
            "radiusX": 1,
            "radiusY": 1,
            "speed": 1,
        }
    },
    "bee_lava": {
        "name": "Lava Bee",
        "image": "bee",
        "palette": "lava",
        "movement": {
            "interval": 5,
            "radiusY": 0,
            "speed": 0.5,
        }
    },
    "bee_emerald": {
        "name": "Emerald Bee",
        "image": "bee",
        "palette": "emerald",
        "movement": {
            "interval": 5,
            "speed": 1,
        }
    },
    "bee_queen": {
        "name": "Queen Bee",
        "image": "bee",
        "palette": "gold",
        "movement": {
            "interval": 5,
            "speed": 1,
        }
    },
    "bee_night": {
        "name": "Night Bee",
        "image": "bee",
        "palette": "night",
        "movement": {
            "interval": 5,
            "speed": 1,
        }
    },
    "bee_pink": {
        "name": "Pink Bee",
        "image": "bee",
        "palette": "pink",
    },

    "slime_lava": {
        "name": "Lava Slime",
        "image": "slime",
        "palette": null,
    },
    "slime_lava_rock": {
        "name": "Lava Rock Slime",
        "image": "slime",
        "palette": "lava-rock",
    },
    "spider": {
        "name": "Forest Spider",
        "image": "spider01",
        "palette": null,
    },
    "black_widow": {
        "name": "Black Widow",
        "image": "spider01",
        "palette": "black-widow",
    },
    "golem": {
        "name": "Golem",
        "image": "golem",
        "palette": null,
    },
    "golem_dirt": {
        "name": "Dirt Golem",
        "image": "golem",
        "palette": "dirt",
    },
    "golem_emerald": {
        "name": "Emerald Golem",
        "image": "golem",
        "palette": "emerald",
    },
    "golem_gold": {
        "name": "Gold Golem",
        "image": "golem",
        "palette": "gold",
    },
    "golem_lava": {
        "name": "Lava Golem",
        "image": "golem",
        "palette": "lava",
    },
    "golem_pink": {
        "name": "Tourmaline Golem",
        "image": "golem",
        "palette": "pink",
    },
    "golem_purple": {
        "name": "Ametrine Golem",
        "image": "golem",
        "palette": "purple",
    },
    "golem_ruby": {
        "name": "Ruby Golem",
        "image": "golem",
        "palette": "ruby",
    }
};