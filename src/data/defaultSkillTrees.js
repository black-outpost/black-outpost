// DEFAULT SKILL TREES DATA
// Auto-generated from tree images
// Do not edit manually — use SkillTreeEditor for nazo trees

export const DEFAULT_SKILL_TREES = {
  "strength": {
    "stat": "strength",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "str_s01",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s02",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s03",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s04",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s05",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1500
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s06",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s07",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s08",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1400
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s09",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s10",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_centrifugal",
        "type": "skill",
        "label": "Centrifugal Force",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1300
        },
        "description": "Twoje techniki szybkiego poruszania si\u0119 maj\u0105 50% wi\u0119kszy zasi\u0119g.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_brutal_force",
        "type": "skill",
        "label": "Brutal Force",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "description": "Mo\u017cesz utworzy\u0107 now\u0105 technik\u0119 na bazie si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_inner_dam",
        "type": "skill",
        "label": "Inner Dam",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1300
        },
        "description": "Techniki z drzewa Si\u0142y s\u0105 50% silniejsze. Techniki z drzewa Tamashi i Reiryoku, 50% s\u0142absze.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s11",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1200
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_centrifugal",
          "str_brutal_force"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s12",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_brutal_force"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s13",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1200
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_inner_dam",
          "str_brutal_force"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_aim_between",
        "type": "skill",
        "label": "Aim Between",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1100
        },
        "description": "Raz na walk\u0119, mo\u017cesz doda\u0107 Szybko\u015b\u0107 do Si\u0142y, przy wykonywanym ataku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_menace_force",
        "type": "skill",
        "label": "Menace Force",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1100
        },
        "description": "Mo\u017cesz ulepszy\u0107 technik\u0119 na bazie si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_spasm",
        "type": "skill",
        "label": "Spasm",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1100
        },
        "description": "Raz na walk\u0119, mo\u017cesz u\u017cy\u0107 Si\u0142y jako Odporno\u015bci, gdy otrzymujesz obra\u017cenia.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s14",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_aim_between"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s15",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_menace_force"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s16",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_spasm"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_eye_splitter",
        "type": "skill",
        "label": "Eye Splitter",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 900
        },
        "description": "Mo\u017cesz ulepszy\u0107 jedn\u0105 technik\u0119 Szybko\u015bci i da\u0107 jej skalowanie od si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_monster",
        "type": "skill",
        "label": "Monster",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 900
        },
        "description": "Mo\u017cesz utworzy\u0107 now\u0105 technik\u0119 na bazie si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s15"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_ferocity",
        "type": "skill",
        "label": "Ferocity",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "description": "Mo\u017cesz ulepszy\u0107 jedn\u0105 technik\u0119 Odporno\u015bci albo Witalno\u015bci i da\u0107 jej skalowanie od si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s17",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 800
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_eye_splitter"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s18",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 800
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_monster"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_s19",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 800
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_ferocity"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s01",
        "type": "stat",
        "label": "+2 SPD",
        "tier": 2,
        "position": {
          "x": 195,
          "y": 400
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 2,
        "requires": [
          "str_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s02",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s03",
        "type": "stat",
        "label": "+2 STR",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 2,
        "requires": [
          "str_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s04",
        "type": "stat",
        "label": "+1 STR",
        "tier": 2,
        "position": {
          "x": 975,
          "y": 400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s05",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "str_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_t2s06",
        "type": "stat",
        "label": "+2 DEF",
        "tier": 2,
        "position": {
          "x": 1365,
          "y": 400
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 2,
        "requires": [
          "str_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "str_sheer_speed",
        "type": "skill",
        "label": "Sheer Speed",
        "tier": 2,
        "position": {
          "x": 195,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu typu 'Sheer'. Raz na walk\u0119, mo\u017cesz podwoi\u0107 swoj\u0105 Szybko\u015b\u0107, przy wykonywanym ataku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "str_sheer_speed"
          }
        ],
        "tags": [
          "sheer"
        ]
      },
      {
        "id": "str_ext_terror",
        "type": "skill",
        "label": "External Terror",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu typu 'External'. Inteligentni przeciwnicy, kt\u00f3rzy ci\u0119 widz\u0105, buduj\u0105 \u0142adunek Strachu z ka\u017cd\u0105 tur\u0105. Znacznie ulepsz wybran\u0105 technik\u0119 na bazie si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_t2s02"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "str_ext_terror"
          }
        ],
        "tags": [
          "external"
        ]
      },
      {
        "id": "str_sheer_strength",
        "type": "skill",
        "label": "Sheer Strength",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu typu 'Sheer'. Raz na walk\u0119, mo\u017cesz podwoi\u0107 swoj\u0105 Si\u0142\u0119, przy wykonywanym ataku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_t2s03"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "str_sheer_strength"
          }
        ],
        "tags": [
          "sheer"
        ]
      },
      {
        "id": "str_ext_ignorance",
        "type": "skill",
        "label": "External Ignorance",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu typu 'External'. Efekty kontroli umys\u0142u wp\u0142ywaj\u0105 na ciebie 50% wolniej. Znacznie ulepsz wybran\u0105 technik\u0119 na bazie si\u0142y.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_t2s04",
          "str_t2s05"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "str_ext_ignorance"
          }
        ],
        "tags": [
          "external"
        ]
      },
      {
        "id": "str_sheer_defense",
        "type": "skill",
        "label": "Sheer Defense",
        "tier": 2,
        "position": {
          "x": 1365,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu typu 'Sheer'. Raz na walk\u0119, mo\u017cesz podwoi\u0107 swoj\u0105 Odporno\u015b\u0107, przy wykonywanym ataku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "str_t2s06"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "str_sheer_defense"
          }
        ],
        "tags": [
          "sheer"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_str_s01__str_s02",
        "source": "str_s01",
        "target": "str_s02"
      },
      {
        "id": "e_str_s01__str_s03",
        "source": "str_s01",
        "target": "str_s03"
      },
      {
        "id": "e_str_s01__str_s04",
        "source": "str_s01",
        "target": "str_s04"
      },
      {
        "id": "e_str_s02__str_s05",
        "source": "str_s02",
        "target": "str_s05"
      },
      {
        "id": "e_str_s03__str_s06",
        "source": "str_s03",
        "target": "str_s06"
      },
      {
        "id": "e_str_s04__str_s07",
        "source": "str_s04",
        "target": "str_s07"
      },
      {
        "id": "e_str_s05__str_s08",
        "source": "str_s05",
        "target": "str_s08"
      },
      {
        "id": "e_str_s06__str_s09",
        "source": "str_s06",
        "target": "str_s09"
      },
      {
        "id": "e_str_s07__str_s10",
        "source": "str_s07",
        "target": "str_s10"
      },
      {
        "id": "e_str_s08__str_centrifugal",
        "source": "str_s08",
        "target": "str_centrifugal"
      },
      {
        "id": "e_str_s09__str_brutal_force",
        "source": "str_s09",
        "target": "str_brutal_force"
      },
      {
        "id": "e_str_s10__str_inner_dam",
        "source": "str_s10",
        "target": "str_inner_dam"
      },
      {
        "id": "e_str_centrifugal__str_s11",
        "source": "str_centrifugal",
        "target": "str_s11"
      },
      {
        "id": "e_str_brutal_force__str_s11",
        "source": "str_brutal_force",
        "target": "str_s11"
      },
      {
        "id": "e_str_brutal_force__str_s12",
        "source": "str_brutal_force",
        "target": "str_s12"
      },
      {
        "id": "e_str_inner_dam__str_s13",
        "source": "str_inner_dam",
        "target": "str_s13"
      },
      {
        "id": "e_str_brutal_force__str_s13",
        "source": "str_brutal_force",
        "target": "str_s13"
      },
      {
        "id": "e_str_s11__str_aim_between",
        "source": "str_s11",
        "target": "str_aim_between"
      },
      {
        "id": "e_str_s12__str_menace_force",
        "source": "str_s12",
        "target": "str_menace_force"
      },
      {
        "id": "e_str_s13__str_spasm",
        "source": "str_s13",
        "target": "str_spasm"
      },
      {
        "id": "e_str_aim_between__str_s14",
        "source": "str_aim_between",
        "target": "str_s14"
      },
      {
        "id": "e_str_menace_force__str_s15",
        "source": "str_menace_force",
        "target": "str_s15"
      },
      {
        "id": "e_str_spasm__str_s16",
        "source": "str_spasm",
        "target": "str_s16"
      },
      {
        "id": "e_str_s14__str_eye_splitter",
        "source": "str_s14",
        "target": "str_eye_splitter"
      },
      {
        "id": "e_str_s15__str_monster",
        "source": "str_s15",
        "target": "str_monster"
      },
      {
        "id": "e_str_s16__str_ferocity",
        "source": "str_s16",
        "target": "str_ferocity"
      },
      {
        "id": "e_str_eye_splitter__str_s17",
        "source": "str_eye_splitter",
        "target": "str_s17"
      },
      {
        "id": "e_str_monster__str_s18",
        "source": "str_monster",
        "target": "str_s18"
      },
      {
        "id": "e_str_ferocity__str_s19",
        "source": "str_ferocity",
        "target": "str_s19"
      },
      {
        "id": "e_str_s17__str_t2s01",
        "source": "str_s17",
        "target": "str_t2s01"
      },
      {
        "id": "e_str_s17__str_t2s02",
        "source": "str_s17",
        "target": "str_t2s02"
      },
      {
        "id": "e_str_s18__str_t2s03",
        "source": "str_s18",
        "target": "str_t2s03"
      },
      {
        "id": "e_str_s18__str_t2s04",
        "source": "str_s18",
        "target": "str_t2s04"
      },
      {
        "id": "e_str_s19__str_t2s05",
        "source": "str_s19",
        "target": "str_t2s05"
      },
      {
        "id": "e_str_s19__str_t2s06",
        "source": "str_s19",
        "target": "str_t2s06"
      },
      {
        "id": "e_str_t2s01__str_sheer_speed",
        "source": "str_t2s01",
        "target": "str_sheer_speed"
      },
      {
        "id": "e_str_t2s02__str_ext_terror",
        "source": "str_t2s02",
        "target": "str_ext_terror"
      },
      {
        "id": "e_str_t2s03__str_sheer_strength",
        "source": "str_t2s03",
        "target": "str_sheer_strength"
      },
      {
        "id": "e_str_t2s04__str_ext_ignorance",
        "source": "str_t2s04",
        "target": "str_ext_ignorance"
      },
      {
        "id": "e_str_t2s05__str_ext_ignorance",
        "source": "str_t2s05",
        "target": "str_ext_ignorance"
      },
      {
        "id": "e_str_t2s06__str_sheer_defense",
        "source": "str_t2s06",
        "target": "str_sheer_defense"
      }
    ]
  },
  "speed": {
    "stat": "speed",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "spd_s01",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s02",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s03",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s04",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s05",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1500
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s06",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s07",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1500
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s08",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1400
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s09",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s10",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_shade_step",
        "type": "skill",
        "label": "Shade's Step",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1300
        },
        "description": "Mo\u017cesz zmodyfikowa\u0107 swoj\u0105 podstawow\u0105 technik\u0119 przemieszczania si\u0119 o aspekt swojej duszy.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_fast_step",
        "type": "skill",
        "label": "Fast Step",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "description": "Otrzymujesz lub ulepszasz podstawow\u0105 technik\u0119 przemieszczania si\u0119 zale\u017cn\u0105 od twojej rasy.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_fair_trade",
        "type": "skill",
        "label": "Fair-Trade",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1300
        },
        "description": "Mo\u017cesz wykonywa\u0107 dwa razy wi\u0119cej atak\u00f3w w turze, kosztem zmniejszenia ich obra\u017ce\u0144 o po\u0142ow\u0119.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s11",
        "type": "stat",
        "label": "+2 SPD",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1200
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 2,
        "requires": [
          "spd_shade_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s12",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1200
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_shade_step",
          "spd_fast_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s13",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_fast_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s14",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1200
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_fair_trade"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s15",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1200
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_fair_trade"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_fast_movement",
        "type": "skill",
        "label": "Fast Movement",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1100
        },
        "description": "Biegasz o 50% szybciej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_sudden_strike",
        "type": "skill",
        "label": "Sudden Strike",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1100
        },
        "description": "Raz na walk\u0119, mo\u017cesz wykona\u0107 atak bez zu\u017cywania akcji.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s15"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s16",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_fast_movement",
          "spd_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s17",
        "type": "stat",
        "label": "+2 SPD",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 2,
        "requires": [
          "spd_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s18",
        "type": "stat",
        "label": "+1 SPD",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "statGrants": {
          "speed": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_sudden_strike",
          "spd_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_flashstep",
        "type": "skill",
        "label": "Flashstep",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 900
        },
        "description": "Twoja podstawowa technika przemieszczania si\u0119 ma zmniejszony czas odnowienia o po\u0142ow\u0119.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_bringerstep",
        "type": "skill",
        "label": "Bringerstep",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 900
        },
        "description": "Twoja podstawowa technika przemieszczania si\u0119 ma zwi\u0119kszony zasi\u0119g dwukrotnie.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_sheer_feather",
        "type": "skill",
        "label": "Sheer Feather",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Sheer'. Ka\u017cdy trafiony atak w serii zyskuje +0.1 mno\u017cnika na obra\u017cenia. Efekt utracony jest po byciu zranionym.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s18"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "spd_sheer_feather"
          }
        ],
        "tags": [
          "sheer"
        ]
      },
      {
        "id": "spd_s19",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 700
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_flashstep"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s20",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 700
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_flashstep",
          "spd_bringerstep"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s21",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 700
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_bringerstep",
          "spd_sheer_feather"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s22",
        "type": "stat",
        "label": "+2 VIT",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 700
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 2,
        "requires": [
          "spd_sheer_feather"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s23",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "spd_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s24",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s25",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s20",
          "spd_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s26",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "spd_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_s27",
        "type": "stat",
        "label": "+2 VIT",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 2,
        "requires": [
          "spd_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "spd_ext_drive",
        "type": "skill",
        "label": "External Drive",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'External'. Podczas biegu i technik na nim bazuj\u0105cych, ci\u0119\u017cej Ciebie trafi\u0107 o 30%. Biegasz o 50% szybciej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s23"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "spd_ext_drive"
          }
        ],
        "tags": [
          "external"
        ]
      },
      {
        "id": "spd_inner_i",
        "type": "skill",
        "label": "Inner I",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. W zamian za po\u015bwi\u0119cenie ca\u0142ej tury na koncentracji, w nast\u0119pnej turze mo\u017cesz zrobi\u0107 jedn\u0105 akcj\u0119 wi\u0119cej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s24"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "spd_inner_i"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "spd_inner_self",
        "type": "skill",
        "label": "Inner Self",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Raz na walk\u0119, jako efekt techniki bazuj\u0105c na teleportacji, mo\u017cesz stworzy\u0107 posta\u0107, kt\u00f3ra na\u015bladuje twoje ruchy. Trwa na dwie tury.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s25"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "spd_inner_self"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "spd_inner_me",
        "type": "skill",
        "label": "Inner Me",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Twoje techniki kt\u00f3re bazuj\u0105 zar\u00f3wno na Reiryoku i teleportacji otrzymuj\u0105 dwukrotnie zwi\u0119kszony zasi\u0119g/zmniejszony koszt/zmniejszony czas odnowienia.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s26"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "spd_inner_me"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "spd_ext_treachery",
        "type": "skill",
        "label": "External Treachery",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'External'. Je\u015bli twoja Szybko\u015b\u0107 jest dwukrotnie wy\u017csza od przeciwnika, twoje ataki trafiaj\u0105 dwukrotnie w dwa r\u00f3\u017cne punkty.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "spd_s27"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "spd_ext_treachery"
          }
        ],
        "tags": [
          "external"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_spd_s01__spd_s02",
        "source": "spd_s01",
        "target": "spd_s02"
      },
      {
        "id": "e_spd_s01__spd_s03",
        "source": "spd_s01",
        "target": "spd_s03"
      },
      {
        "id": "e_spd_s01__spd_s04",
        "source": "spd_s01",
        "target": "spd_s04"
      },
      {
        "id": "e_spd_s02__spd_s05",
        "source": "spd_s02",
        "target": "spd_s05"
      },
      {
        "id": "e_spd_s03__spd_s06",
        "source": "spd_s03",
        "target": "spd_s06"
      },
      {
        "id": "e_spd_s04__spd_s07",
        "source": "spd_s04",
        "target": "spd_s07"
      },
      {
        "id": "e_spd_s05__spd_s08",
        "source": "spd_s05",
        "target": "spd_s08"
      },
      {
        "id": "e_spd_s06__spd_s09",
        "source": "spd_s06",
        "target": "spd_s09"
      },
      {
        "id": "e_spd_s07__spd_s10",
        "source": "spd_s07",
        "target": "spd_s10"
      },
      {
        "id": "e_spd_s08__spd_shade_step",
        "source": "spd_s08",
        "target": "spd_shade_step"
      },
      {
        "id": "e_spd_s09__spd_fast_step",
        "source": "spd_s09",
        "target": "spd_fast_step"
      },
      {
        "id": "e_spd_s10__spd_fair_trade",
        "source": "spd_s10",
        "target": "spd_fair_trade"
      },
      {
        "id": "e_spd_shade_step__spd_s11",
        "source": "spd_shade_step",
        "target": "spd_s11"
      },
      {
        "id": "e_spd_shade_step__spd_s12",
        "source": "spd_shade_step",
        "target": "spd_s12"
      },
      {
        "id": "e_spd_fast_step__spd_s12",
        "source": "spd_fast_step",
        "target": "spd_s12"
      },
      {
        "id": "e_spd_fast_step__spd_s13",
        "source": "spd_fast_step",
        "target": "spd_s13"
      },
      {
        "id": "e_spd_fair_trade__spd_s14",
        "source": "spd_fair_trade",
        "target": "spd_s14"
      },
      {
        "id": "e_spd_fair_trade__spd_s15",
        "source": "spd_fair_trade",
        "target": "spd_s15"
      },
      {
        "id": "e_spd_s11__spd_fast_movement",
        "source": "spd_s11",
        "target": "spd_fast_movement"
      },
      {
        "id": "e_spd_s15__spd_sudden_strike",
        "source": "spd_s15",
        "target": "spd_sudden_strike"
      },
      {
        "id": "e_spd_fast_movement__spd_s16",
        "source": "spd_fast_movement",
        "target": "spd_s16"
      },
      {
        "id": "e_spd_s12__spd_s16",
        "source": "spd_s12",
        "target": "spd_s16"
      },
      {
        "id": "e_spd_s13__spd_s17",
        "source": "spd_s13",
        "target": "spd_s17"
      },
      {
        "id": "e_spd_sudden_strike__spd_s18",
        "source": "spd_sudden_strike",
        "target": "spd_s18"
      },
      {
        "id": "e_spd_s14__spd_s18",
        "source": "spd_s14",
        "target": "spd_s18"
      },
      {
        "id": "e_spd_s16__spd_flashstep",
        "source": "spd_s16",
        "target": "spd_flashstep"
      },
      {
        "id": "e_spd_s17__spd_bringerstep",
        "source": "spd_s17",
        "target": "spd_bringerstep"
      },
      {
        "id": "e_spd_s18__spd_sheer_feather",
        "source": "spd_s18",
        "target": "spd_sheer_feather"
      },
      {
        "id": "e_spd_flashstep__spd_s19",
        "source": "spd_flashstep",
        "target": "spd_s19"
      },
      {
        "id": "e_spd_flashstep__spd_s20",
        "source": "spd_flashstep",
        "target": "spd_s20"
      },
      {
        "id": "e_spd_bringerstep__spd_s20",
        "source": "spd_bringerstep",
        "target": "spd_s20"
      },
      {
        "id": "e_spd_bringerstep__spd_s21",
        "source": "spd_bringerstep",
        "target": "spd_s21"
      },
      {
        "id": "e_spd_sheer_feather__spd_s21",
        "source": "spd_sheer_feather",
        "target": "spd_s21"
      },
      {
        "id": "e_spd_sheer_feather__spd_s22",
        "source": "spd_sheer_feather",
        "target": "spd_s22"
      },
      {
        "id": "e_spd_s19__spd_s23",
        "source": "spd_s19",
        "target": "spd_s23"
      },
      {
        "id": "e_spd_s20__spd_s24",
        "source": "spd_s20",
        "target": "spd_s24"
      },
      {
        "id": "e_spd_s20__spd_s25",
        "source": "spd_s20",
        "target": "spd_s25"
      },
      {
        "id": "e_spd_s21__spd_s25",
        "source": "spd_s21",
        "target": "spd_s25"
      },
      {
        "id": "e_spd_s21__spd_s26",
        "source": "spd_s21",
        "target": "spd_s26"
      },
      {
        "id": "e_spd_s22__spd_s27",
        "source": "spd_s22",
        "target": "spd_s27"
      },
      {
        "id": "e_spd_s23__spd_ext_drive",
        "source": "spd_s23",
        "target": "spd_ext_drive"
      },
      {
        "id": "e_spd_s24__spd_inner_i",
        "source": "spd_s24",
        "target": "spd_inner_i"
      },
      {
        "id": "e_spd_s25__spd_inner_self",
        "source": "spd_s25",
        "target": "spd_inner_self"
      },
      {
        "id": "e_spd_s26__spd_inner_me",
        "source": "spd_s26",
        "target": "spd_inner_me"
      },
      {
        "id": "e_spd_s27__spd_ext_treachery",
        "source": "spd_s27",
        "target": "spd_ext_treachery"
      }
    ]
  },
  "vitality": {
    "stat": "vitality",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "vit_s01",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s02",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s03",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s04",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s05",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1500
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s06",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s07",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s08",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s09",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s10",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s11",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s12",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1400
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_shuten",
        "type": "skill",
        "label": "Shuten-d\u014dji",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1300
        },
        "description": "W trakcie walki, mo\u017cesz tymczasowo po\u015bwi\u0119ca\u0107 Witalno\u015b\u0107, na rzecz Reiatsu w konwersji 1:1.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_s10",
          "vit_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_empty_shell",
        "type": "skill",
        "label": "Empty Shell",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1300
        },
        "description": "Tracenie ko\u0144czyn i organ\u00f3w a tak\u017ce negatywne efekty, maj\u0105 2 razy trudniej, by ci\u0119 faktycznie zabi\u0107.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s13",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1200
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_shuten"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s14",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1200
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_shuten"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s15",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s16",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1200
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s17",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1200
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_empty_shell"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_vital_furnace",
        "type": "skill",
        "label": "Vital Furnace",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1100
        },
        "description": "Mo\u017cesz utworzy\u0107 now\u0105 technik\u0119 na bazie witalno\u015bci.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_s13",
          "vit_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_common_deal",
        "type": "skill",
        "label": "Common Deal",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1100
        },
        "description": "Raz na walk\u0119, mo\u017cesz po\u015bwi\u0119ci\u0107 po\u0142ow\u0119 swojego maksymalnego Reiatsu, by uleczy\u0107 si\u0119 z wybranej ci\u0119\u017cszej rany.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_s15",
          "vit_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_powerhouse",
        "type": "skill",
        "label": "Powerhouse",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1100
        },
        "description": "Techniki lecz\u0105ce stworzone przez ciebie, dzia\u0142aj\u0105 na ciebie dwukrotnie lepiej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s18",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_vital_furnace"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s19",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_common_deal"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s20",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1000
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_common_deal",
          "vit_powerhouse"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s21",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1000
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_powerhouse",
          "vit_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s22",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 800
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s23",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 800
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s19",
          "vit_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_s24",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 800
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s01",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s02",
        "type": "stat",
        "label": "+2 VIT",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 2,
        "requires": [
          "vit_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s03",
        "type": "stat",
        "label": "+2 VIT",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 2,
        "requires": [
          "vit_s23"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s04",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s05",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s06",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 300
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_t2s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s07",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 300
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "vit_t2s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_t2s08",
        "type": "stat",
        "label": "+2 DEF",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 300
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 2,
        "requires": [
          "vit_t2s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "vit_sheer_pacifist",
        "type": "skill",
        "label": "Sheer Pacifist",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Sheer'. Pierwsze leczenie w rundzie nie zu\u017cywa akcji.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_t2s06"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "vit_sheer_pacifist"
          }
        ],
        "tags": [
          "sheer"
        ]
      },
      {
        "id": "vit_inner_vitality",
        "type": "skill",
        "label": "Inner Vitality",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Wszystkie w\u0119z\u0142y posiadaj\u0105ce w nazwie 'Vital' s\u0105 dwukrotnie silniejsze. Mo\u017cesz ulepszy\u0107 technik\u0119 na osi Witalno\u015bci.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_t2s02"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "vit_inner_vitality"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "vit_inner_sun",
        "type": "skill",
        "label": "Inner Sun",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Jeste\u015b w stanie znie\u015b\u0107 dwukrotnie wi\u0119cej obra\u017ce\u0144.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_t2s03",
          "vit_t2s07"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "vit_inner_sun"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "vit_inner_life",
        "type": "skill",
        "label": "Inner Life",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Po up\u0142ywie doby od \u015bmierci, twoje ostatki Reishi o\u017cywiaj\u0105 ci\u0119, je\u015bli masz jak.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_t2s04",
          "vit_t2s07"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "vit_inner_life"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "vit_sheer_death",
        "type": "skill",
        "label": "Sheer Death",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Sheer'. Przeciwnik nie jest w stanie okre\u015bli\u0107 w jakim jest stanie. Zyskujesz 25% szans na unikni\u0119cie kontroli t\u0142umu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "vit_t2s08"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "vit_sheer_death"
          }
        ],
        "tags": [
          "sheer"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_vit_s01__vit_s02",
        "source": "vit_s01",
        "target": "vit_s02"
      },
      {
        "id": "e_vit_s01__vit_s03",
        "source": "vit_s01",
        "target": "vit_s03"
      },
      {
        "id": "e_vit_s01__vit_s04",
        "source": "vit_s01",
        "target": "vit_s04"
      },
      {
        "id": "e_vit_s02__vit_s05",
        "source": "vit_s02",
        "target": "vit_s05"
      },
      {
        "id": "e_vit_s02__vit_s06",
        "source": "vit_s02",
        "target": "vit_s06"
      },
      {
        "id": "e_vit_s03__vit_s07",
        "source": "vit_s03",
        "target": "vit_s07"
      },
      {
        "id": "e_vit_s04__vit_s08",
        "source": "vit_s04",
        "target": "vit_s08"
      },
      {
        "id": "e_vit_s04__vit_s09",
        "source": "vit_s04",
        "target": "vit_s09"
      },
      {
        "id": "e_vit_s05__vit_s10",
        "source": "vit_s05",
        "target": "vit_s10"
      },
      {
        "id": "e_vit_s06__vit_s11",
        "source": "vit_s06",
        "target": "vit_s11"
      },
      {
        "id": "e_vit_s09__vit_s12",
        "source": "vit_s09",
        "target": "vit_s12"
      },
      {
        "id": "e_vit_s10__vit_shuten",
        "source": "vit_s10",
        "target": "vit_shuten"
      },
      {
        "id": "e_vit_s11__vit_shuten",
        "source": "vit_s11",
        "target": "vit_shuten"
      },
      {
        "id": "e_vit_s12__vit_empty_shell",
        "source": "vit_s12",
        "target": "vit_empty_shell"
      },
      {
        "id": "e_vit_shuten__vit_s13",
        "source": "vit_shuten",
        "target": "vit_s13"
      },
      {
        "id": "e_vit_shuten__vit_s14",
        "source": "vit_shuten",
        "target": "vit_s14"
      },
      {
        "id": "e_vit_s07__vit_s15",
        "source": "vit_s07",
        "target": "vit_s15"
      },
      {
        "id": "e_vit_s08__vit_s16",
        "source": "vit_s08",
        "target": "vit_s16"
      },
      {
        "id": "e_vit_empty_shell__vit_s17",
        "source": "vit_empty_shell",
        "target": "vit_s17"
      },
      {
        "id": "e_vit_s13__vit_vital_furnace",
        "source": "vit_s13",
        "target": "vit_vital_furnace"
      },
      {
        "id": "e_vit_s14__vit_vital_furnace",
        "source": "vit_s14",
        "target": "vit_vital_furnace"
      },
      {
        "id": "e_vit_s15__vit_common_deal",
        "source": "vit_s15",
        "target": "vit_common_deal"
      },
      {
        "id": "e_vit_s16__vit_common_deal",
        "source": "vit_s16",
        "target": "vit_common_deal"
      },
      {
        "id": "e_vit_s16__vit_powerhouse",
        "source": "vit_s16",
        "target": "vit_powerhouse"
      },
      {
        "id": "e_vit_vital_furnace__vit_s18",
        "source": "vit_vital_furnace",
        "target": "vit_s18"
      },
      {
        "id": "e_vit_common_deal__vit_s19",
        "source": "vit_common_deal",
        "target": "vit_s19"
      },
      {
        "id": "e_vit_common_deal__vit_s20",
        "source": "vit_common_deal",
        "target": "vit_s20"
      },
      {
        "id": "e_vit_powerhouse__vit_s20",
        "source": "vit_powerhouse",
        "target": "vit_s20"
      },
      {
        "id": "e_vit_powerhouse__vit_s21",
        "source": "vit_powerhouse",
        "target": "vit_s21"
      },
      {
        "id": "e_vit_s17__vit_s21",
        "source": "vit_s17",
        "target": "vit_s21"
      },
      {
        "id": "e_vit_s18__vit_s22",
        "source": "vit_s18",
        "target": "vit_s22"
      },
      {
        "id": "e_vit_s19__vit_s23",
        "source": "vit_s19",
        "target": "vit_s23"
      },
      {
        "id": "e_vit_s20__vit_s23",
        "source": "vit_s20",
        "target": "vit_s23"
      },
      {
        "id": "e_vit_s21__vit_s24",
        "source": "vit_s21",
        "target": "vit_s24"
      },
      {
        "id": "e_vit_s22__vit_t2s01",
        "source": "vit_s22",
        "target": "vit_t2s01"
      },
      {
        "id": "e_vit_s22__vit_t2s02",
        "source": "vit_s22",
        "target": "vit_t2s02"
      },
      {
        "id": "e_vit_s23__vit_t2s03",
        "source": "vit_s23",
        "target": "vit_t2s03"
      },
      {
        "id": "e_vit_s24__vit_t2s04",
        "source": "vit_s24",
        "target": "vit_t2s04"
      },
      {
        "id": "e_vit_s24__vit_t2s05",
        "source": "vit_s24",
        "target": "vit_t2s05"
      },
      {
        "id": "e_vit_t2s01__vit_t2s06",
        "source": "vit_t2s01",
        "target": "vit_t2s06"
      },
      {
        "id": "e_vit_t2s03__vit_t2s07",
        "source": "vit_t2s03",
        "target": "vit_t2s07"
      },
      {
        "id": "e_vit_t2s05__vit_t2s08",
        "source": "vit_t2s05",
        "target": "vit_t2s08"
      },
      {
        "id": "e_vit_t2s06__vit_sheer_pacifist",
        "source": "vit_t2s06",
        "target": "vit_sheer_pacifist"
      },
      {
        "id": "e_vit_t2s02__vit_inner_vitality",
        "source": "vit_t2s02",
        "target": "vit_inner_vitality"
      },
      {
        "id": "e_vit_t2s03__vit_inner_sun",
        "source": "vit_t2s03",
        "target": "vit_inner_sun"
      },
      {
        "id": "e_vit_t2s07__vit_inner_sun",
        "source": "vit_t2s07",
        "target": "vit_inner_sun"
      },
      {
        "id": "e_vit_t2s04__vit_inner_life",
        "source": "vit_t2s04",
        "target": "vit_inner_life"
      },
      {
        "id": "e_vit_t2s07__vit_inner_life",
        "source": "vit_t2s07",
        "target": "vit_inner_life"
      },
      {
        "id": "e_vit_t2s08__vit_sheer_death",
        "source": "vit_t2s08",
        "target": "vit_sheer_death"
      }
    ]
  },
  "defense": {
    "stat": "defense",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "def_s01",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s02",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s03",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s04",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s05",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1500
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s06",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s07",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s08",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s09",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1500
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s10",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s05",
          "def_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s11",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s12",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s08",
          "def_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_stone_shard",
        "type": "skill",
        "label": "Stone Shard",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1300
        },
        "description": "Mo\u017cesz ulepszy\u0107 swoj\u0105 technik\u0119 na bazie defensywy i doda\u0107 jej aspekt opieraj\u0105cy o Reiatsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_vital_shard",
        "type": "skill",
        "label": "Vital Shard",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1300
        },
        "description": "Mo\u017cesz ulepszy\u0107 swoj\u0105 technik\u0119 na bazie defensywy i doda\u0107 jej aspekt opieraj\u0105cy o Witalno\u015b\u0107.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s13",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1200
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_stone_shard"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s14",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1200
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_stone_shard",
          "def_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s15",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s16",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1200
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_vital_shard",
          "def_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s17",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1200
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_vital_shard"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_reishi_sponge",
        "type": "skill",
        "label": "Reishi Sponge",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1100
        },
        "description": "Otrzymujesz bonus 10% do si\u0142y oraz 5% bonus do resty statystyk (poza obron\u0119), za ka\u017cdy punkt Obrony. Negatywne statusy trwaj\u0105 na tobie dwukrotnie d\u0142u\u017cej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_stoneheart",
        "type": "skill",
        "label": "Stoneheart",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1100
        },
        "description": "Mo\u017cesz utworzy\u0107 now\u0105 technik\u0119 na bazie Obrony.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s14",
          "def_s15"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_nihilistic_path",
        "type": "skill",
        "label": "Nihilistic Path",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1100
        },
        "description": "Otrzymuj\u0105c obra\u017cenia, zwi\u0119kszasz jedn\u0105 wybran\u0105 statystyk\u0119 adekwatnie do spadku \u017cycia. Nie mo\u017cesz korzysta\u0107 z benefit\u00f3w zbroi.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s18",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1000
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_reishi_sponge"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s19",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1000
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_stoneheart"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s20",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1000
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_stoneheart"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s21",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_nihilistic_path"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s22",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1000
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_nihilistic_path"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_bujutsu_hardship",
        "type": "skill",
        "label": "Bujutsu Hardship",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 900
        },
        "description": "Twoje techniki walki wr\u0119cz zadaj\u0105 dodatkowe obra\u017cenia zale\u017cne od Obrony (ok. 25% przelicznika dodatkowego).",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_stone_shrine",
        "type": "skill",
        "label": "Stone Shrine",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 900
        },
        "description": "Podczas przyjmowania pozycji obronnej, twoja statystyka Obrony jest o 25% efektywniejsza.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_counterfeit_counter",
        "type": "skill",
        "label": "Counterfeit Counter",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "description": "Podczas otrzymywania ataku, maksymalnie dwa razy na rund\u0119 mo\u017cesz wykona\u0107 kontratak podstawowym atakiem. Twoja Szybko\u015b\u0107 jest zmniejszona o 25%.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s20",
          "def_s21",
          "def_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s23",
        "type": "stat",
        "label": "+1 STR",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 800
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_bujutsu_hardship"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s24",
        "type": "stat",
        "label": "+1 DEF",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 800
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_stone_shrine"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s25",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 800
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_counterfeit_counter"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s26",
        "type": "stat",
        "label": "+2 STR",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 2,
        "requires": [
          "def_s23"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s27",
        "type": "stat",
        "label": "+1 STR",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "strength": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s23",
          "def_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s28",
        "type": "stat",
        "label": "+2 DEF",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "defense": 1
        },
        "maxPurchases": 2,
        "requires": [
          "def_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s29",
        "type": "stat",
        "label": "+1 VIT",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 1,
        "requires": [
          "def_s25"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_s30",
        "type": "stat",
        "label": "+2 VIT",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "vitality": 1
        },
        "maxPurchases": 2,
        "requires": [
          "def_s25"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "def_sheer_oblivion",
        "type": "skill",
        "label": "Sheer Oblivion",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Sheer'. Mo\u017cesz blokowa\u0107 ataki, nawet je\u015bli s\u0105 zbyt szybkie. Od teraz jeste\u015b \u015blepy.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s26"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "def_sheer_oblivion"
          }
        ],
        "tags": [
          "sheer"
        ]
      },
      {
        "id": "def_ext_shatter",
        "type": "skill",
        "label": "External Shatter",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'External'. Twoje bronie od teraz skaluj\u0105 obra\u017cenia od Obrony, ale niszcz\u0105 si\u0119 dwukrotnie szybciej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s27"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "def_ext_shatter"
          }
        ],
        "tags": [
          "external"
        ]
      },
      {
        "id": "def_inner_courtesy",
        "type": "skill",
        "label": "Inner Courtesy",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Inner'. Je\u015bli sojusznik w zasi\u0119gu 5 metr\u00f3w otrzymuje atak, mo\u017cesz go przekierowa\u0107 w pe\u0142ni na siebie.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s28"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "inner"
            ],
            "excludeNodeId": "def_inner_courtesy"
          }
        ],
        "tags": [
          "inner"
        ]
      },
      {
        "id": "def_ext_whisper",
        "type": "skill",
        "label": "External Whisper",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'External'. Twoje pozytywne efekty nak\u0142adane na innych s\u0105 w 50% efektywniejsze.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s29"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "external"
            ],
            "excludeNodeId": "def_ext_whisper"
          }
        ],
        "tags": [
          "external"
        ]
      },
      {
        "id": "def_sheer_behemot",
        "type": "skill",
        "label": "Sheer Behemot",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Sheer'. Wszystkie w\u0119z\u0142y i bonusy daj\u0105ce Szybko\u015b\u0107, daj\u0105 jej po\u0142ow\u0119 i drug\u0105 po\u0142ow\u0119 zmieniona jest na Obron\u0119.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "def_s30"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "sheer"
            ],
            "excludeNodeId": "def_sheer_behemot"
          }
        ],
        "tags": [
          "sheer"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_def_s01__def_s02",
        "source": "def_s01",
        "target": "def_s02"
      },
      {
        "id": "e_def_s01__def_s03",
        "source": "def_s01",
        "target": "def_s03"
      },
      {
        "id": "e_def_s01__def_s04",
        "source": "def_s01",
        "target": "def_s04"
      },
      {
        "id": "e_def_s02__def_s05",
        "source": "def_s02",
        "target": "def_s05"
      },
      {
        "id": "e_def_s02__def_s06",
        "source": "def_s02",
        "target": "def_s06"
      },
      {
        "id": "e_def_s03__def_s07",
        "source": "def_s03",
        "target": "def_s07"
      },
      {
        "id": "e_def_s04__def_s08",
        "source": "def_s04",
        "target": "def_s08"
      },
      {
        "id": "e_def_s04__def_s09",
        "source": "def_s04",
        "target": "def_s09"
      },
      {
        "id": "e_def_s05__def_s10",
        "source": "def_s05",
        "target": "def_s10"
      },
      {
        "id": "e_def_s06__def_s10",
        "source": "def_s06",
        "target": "def_s10"
      },
      {
        "id": "e_def_s07__def_s11",
        "source": "def_s07",
        "target": "def_s11"
      },
      {
        "id": "e_def_s08__def_s12",
        "source": "def_s08",
        "target": "def_s12"
      },
      {
        "id": "e_def_s09__def_s12",
        "source": "def_s09",
        "target": "def_s12"
      },
      {
        "id": "e_def_s10__def_stone_shard",
        "source": "def_s10",
        "target": "def_stone_shard"
      },
      {
        "id": "e_def_s12__def_vital_shard",
        "source": "def_s12",
        "target": "def_vital_shard"
      },
      {
        "id": "e_def_stone_shard__def_s13",
        "source": "def_stone_shard",
        "target": "def_s13"
      },
      {
        "id": "e_def_stone_shard__def_s14",
        "source": "def_stone_shard",
        "target": "def_s14"
      },
      {
        "id": "e_def_s11__def_s14",
        "source": "def_s11",
        "target": "def_s14"
      },
      {
        "id": "e_def_s11__def_s15",
        "source": "def_s11",
        "target": "def_s15"
      },
      {
        "id": "e_def_vital_shard__def_s16",
        "source": "def_vital_shard",
        "target": "def_s16"
      },
      {
        "id": "e_def_s11__def_s16",
        "source": "def_s11",
        "target": "def_s16"
      },
      {
        "id": "e_def_vital_shard__def_s17",
        "source": "def_vital_shard",
        "target": "def_s17"
      },
      {
        "id": "e_def_s13__def_reishi_sponge",
        "source": "def_s13",
        "target": "def_reishi_sponge"
      },
      {
        "id": "e_def_s14__def_stoneheart",
        "source": "def_s14",
        "target": "def_stoneheart"
      },
      {
        "id": "e_def_s15__def_stoneheart",
        "source": "def_s15",
        "target": "def_stoneheart"
      },
      {
        "id": "e_def_s17__def_nihilistic_path",
        "source": "def_s17",
        "target": "def_nihilistic_path"
      },
      {
        "id": "e_def_reishi_sponge__def_s18",
        "source": "def_reishi_sponge",
        "target": "def_s18"
      },
      {
        "id": "e_def_stoneheart__def_s19",
        "source": "def_stoneheart",
        "target": "def_s19"
      },
      {
        "id": "e_def_stoneheart__def_s20",
        "source": "def_stoneheart",
        "target": "def_s20"
      },
      {
        "id": "e_def_nihilistic_path__def_s21",
        "source": "def_nihilistic_path",
        "target": "def_s21"
      },
      {
        "id": "e_def_nihilistic_path__def_s22",
        "source": "def_nihilistic_path",
        "target": "def_s22"
      },
      {
        "id": "e_def_s18__def_bujutsu_hardship",
        "source": "def_s18",
        "target": "def_bujutsu_hardship"
      },
      {
        "id": "e_def_s19__def_stone_shrine",
        "source": "def_s19",
        "target": "def_stone_shrine"
      },
      {
        "id": "e_def_s20__def_counterfeit_counter",
        "source": "def_s20",
        "target": "def_counterfeit_counter"
      },
      {
        "id": "e_def_s21__def_counterfeit_counter",
        "source": "def_s21",
        "target": "def_counterfeit_counter"
      },
      {
        "id": "e_def_s22__def_counterfeit_counter",
        "source": "def_s22",
        "target": "def_counterfeit_counter"
      },
      {
        "id": "e_def_bujutsu_hardship__def_s23",
        "source": "def_bujutsu_hardship",
        "target": "def_s23"
      },
      {
        "id": "e_def_stone_shrine__def_s24",
        "source": "def_stone_shrine",
        "target": "def_s24"
      },
      {
        "id": "e_def_counterfeit_counter__def_s25",
        "source": "def_counterfeit_counter",
        "target": "def_s25"
      },
      {
        "id": "e_def_s23__def_s26",
        "source": "def_s23",
        "target": "def_s26"
      },
      {
        "id": "e_def_s23__def_s27",
        "source": "def_s23",
        "target": "def_s27"
      },
      {
        "id": "e_def_s24__def_s27",
        "source": "def_s24",
        "target": "def_s27"
      },
      {
        "id": "e_def_s24__def_s28",
        "source": "def_s24",
        "target": "def_s28"
      },
      {
        "id": "e_def_s25__def_s29",
        "source": "def_s25",
        "target": "def_s29"
      },
      {
        "id": "e_def_s25__def_s30",
        "source": "def_s25",
        "target": "def_s30"
      },
      {
        "id": "e_def_s26__def_sheer_oblivion",
        "source": "def_s26",
        "target": "def_sheer_oblivion"
      },
      {
        "id": "e_def_s27__def_ext_shatter",
        "source": "def_s27",
        "target": "def_ext_shatter"
      },
      {
        "id": "e_def_s28__def_inner_courtesy",
        "source": "def_s28",
        "target": "def_inner_courtesy"
      },
      {
        "id": "e_def_s29__def_ext_whisper",
        "source": "def_s29",
        "target": "def_ext_whisper"
      },
      {
        "id": "e_def_s30__def_sheer_behemot",
        "source": "def_s30",
        "target": "def_sheer_behemot"
      }
    ]
  },
  "reiatsu": {
    "stat": "reiatsu",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "ras_s01",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s02",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s03",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s04",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s05",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s06",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s07",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s08",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s09",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s10",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s11",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1300
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s12",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s13",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1300
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_slow_steps",
        "type": "skill",
        "label": "Slow Steps",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1200
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Don't Look Back'. Twoje wyczuwanie Reiatsu jest znacznie polepszone.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s11"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_dont_look_back"
            ],
            "excludeNodeId": "ras_slow_steps"
          }
        ],
        "tags": [
          "ras_slow_steps"
        ]
      },
      {
        "id": "ras_dont_look_back",
        "type": "skill",
        "label": "Don't Look Back",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1200
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Slow Steps'. Twoja nauka technik na bazie Reiatsu jest dwa razy bardziej efektywna.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s13"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_slow_steps"
            ],
            "excludeNodeId": "ras_dont_look_back"
          }
        ],
        "tags": [
          "ras_dont_look_back"
        ]
      },
      {
        "id": "ras_s14",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1100
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_slow_steps",
          "ras_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s15",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1100
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s16",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1100
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_dont_look_back",
          "ras_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_first_step",
        "type": "skill",
        "label": "First Step",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "description": "Pozwala utworzy\u0107 lub ulepszy\u0107 technik\u0119 na bazie Reiatsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_last_step",
        "type": "skill",
        "label": "Last Step",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "description": "Pozwala utworzy\u0107 lub ulepszy\u0107 technik\u0119 na bazie Reiatsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s17",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 900
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_first_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s18",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 900
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_first_step",
          "ras_s15",
          "ras_last_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s19",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_last_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s20",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 800
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s21",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 800
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s22",
        "type": "stat",
        "label": "+1 RAS",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 800
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ras_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_step_by_step",
        "type": "skill",
        "label": "Step by Step",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 700
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Little Steps'. Ka\u017cde trafienie atakiem bia\u0142ym b\u0105d\u017a technik\u0105 na bazie Reiatsu odnawia jej 5%.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s20"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_little_steps"
            ],
            "excludeNodeId": "ras_step_by_step"
          }
        ],
        "tags": [
          "ras_step_by_step"
        ]
      },
      {
        "id": "ras_little_steps",
        "type": "skill",
        "label": "Little Steps",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 700
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Step by Step'. Za ka\u017cdym razem gdy odnawiasz Reiatsu, odnawiasz te\u017c 1% maks. zasobu, lub 5% je\u015bli jeste\u015b powa\u017cnie ranny (HP < 30%).",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s22"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_step_by_step"
            ],
            "excludeNodeId": "ras_little_steps"
          }
        ],
        "tags": [
          "ras_little_steps"
        ]
      },
      {
        "id": "ras_s23",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_step_by_step"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s24",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_s25",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 600
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_little_steps"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_grave_step",
        "type": "skill",
        "label": "Grave Step",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 500
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Side Step'. Mo\u017cesz pozby\u0107 si\u0119 mo\u017cliwo\u015bci Uniku i Bloku na czas 10 tur. W tym czasie zyskujesz 1.5x mno\u017cnik Reiatsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s23"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_side_step"
            ],
            "excludeNodeId": "ras_grave_step"
          }
        ],
        "tags": [
          "ras_grave_step"
        ]
      },
      {
        "id": "ras_side_step",
        "type": "skill",
        "label": "Side Step",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 500
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Grave Step'. Wyczuwasz ataki duchowe, nawet je\u015bli twoje zmys\u0142y ich nie wy\u0142apuj\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_s25"
        ],
        "blocks": [
          {
            "tree": "reiatsu",
            "tags": [
              "ras_grave_step"
            ],
            "excludeNodeId": "ras_side_step"
          }
        ],
        "tags": [
          "ras_side_step"
        ]
      },
      {
        "id": "ras_t2s01",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 2,
        "position": {
          "x": 195,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_grave_step",
          "ras_s23"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_t2s02",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 2,
        "position": {
          "x": 585,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_grave_step",
          "ras_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_t2s03",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 2,
        "position": {
          "x": 975,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_side_step",
          "ras_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_t2s04",
        "type": "stat",
        "label": "+2 RAS",
        "tier": 2,
        "position": {
          "x": 1365,
          "y": 400
        },
        "statGrants": {
          "reiatsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ras_side_step",
          "ras_s25"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ras_hopeful_fall",
        "type": "skill",
        "label": "Hopeful Fall",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Hopeful'. Za ka\u017cdy punkt aktualnie posiadanego Reiatsu, wszystkie pozosta\u0142e statystyki podstawowe wzrastaj\u0105 o 0.1. Poni\u017cej po\u0142owy maks. Reiatsu efekt jest odwrotny.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ras_hopeful_fall"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ras_hopeful_reunion",
        "type": "skill",
        "label": "Hopeful Reunion",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Hopeful'. Rozpoznajesz \u015blad Reiatsu swoich poznanych sojusznik\u00f3w i wrog\u00f3w z najdalszych odleg\u0142o\u015bci.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_t2s02"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ras_hopeful_reunion"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ras_hopeful_fragile",
        "type": "skill",
        "label": "Hopeful Fragile Talent",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Hopeful'. Mo\u017cesz wzi\u0105\u0107 dodatkowy talent 'Inner' lub 'External'. Twoje statystyki Reiatsu spadaj\u0105 o po\u0142ow\u0119 na sta\u0142e.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_t2s02",
          "ras_t2s03"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ras_hopeful_fragile"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ras_hopeful_void",
        "type": "skill",
        "label": "Hopeful Void",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Hopeful'. Mo\u017cesz wyzby\u0107 si\u0119 swojego Reiatsu na czas 10 tur. Podczas tego twoje podstawowe statystyki s\u0105 dwukrotnie wy\u017csze.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_t2s03"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ras_hopeful_void"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ras_hopeful_deceit",
        "type": "skill",
        "label": "Hopeful Deceit",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Hopeful'. Mo\u017cesz dowolnie kontrolowa\u0107 ilo\u015b\u0107 wypuszczonego Reiatsu przez presj\u0119 i techniki, od 0% do 50%.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ras_t2s04"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ras_hopeful_deceit"
          }
        ],
        "tags": [
          "hopeful"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_ras_s01__ras_s02",
        "source": "ras_s01",
        "target": "ras_s02"
      },
      {
        "id": "e_ras_s01__ras_s03",
        "source": "ras_s01",
        "target": "ras_s03"
      },
      {
        "id": "e_ras_s01__ras_s04",
        "source": "ras_s01",
        "target": "ras_s04"
      },
      {
        "id": "e_ras_s02__ras_s05",
        "source": "ras_s02",
        "target": "ras_s05"
      },
      {
        "id": "e_ras_s03__ras_s06",
        "source": "ras_s03",
        "target": "ras_s06"
      },
      {
        "id": "e_ras_s04__ras_s07",
        "source": "ras_s04",
        "target": "ras_s07"
      },
      {
        "id": "e_ras_s05__ras_s08",
        "source": "ras_s05",
        "target": "ras_s08"
      },
      {
        "id": "e_ras_s06__ras_s09",
        "source": "ras_s06",
        "target": "ras_s09"
      },
      {
        "id": "e_ras_s07__ras_s10",
        "source": "ras_s07",
        "target": "ras_s10"
      },
      {
        "id": "e_ras_s08__ras_s11",
        "source": "ras_s08",
        "target": "ras_s11"
      },
      {
        "id": "e_ras_s09__ras_s12",
        "source": "ras_s09",
        "target": "ras_s12"
      },
      {
        "id": "e_ras_s10__ras_s13",
        "source": "ras_s10",
        "target": "ras_s13"
      },
      {
        "id": "e_ras_s11__ras_slow_steps",
        "source": "ras_s11",
        "target": "ras_slow_steps"
      },
      {
        "id": "e_ras_s13__ras_dont_look_back",
        "source": "ras_s13",
        "target": "ras_dont_look_back"
      },
      {
        "id": "e_ras_slow_steps__ras_s14",
        "source": "ras_slow_steps",
        "target": "ras_s14"
      },
      {
        "id": "e_ras_s12__ras_s14",
        "source": "ras_s12",
        "target": "ras_s14"
      },
      {
        "id": "e_ras_s12__ras_s15",
        "source": "ras_s12",
        "target": "ras_s15"
      },
      {
        "id": "e_ras_dont_look_back__ras_s16",
        "source": "ras_dont_look_back",
        "target": "ras_s16"
      },
      {
        "id": "e_ras_s12__ras_s16",
        "source": "ras_s12",
        "target": "ras_s16"
      },
      {
        "id": "e_ras_s14__ras_first_step",
        "source": "ras_s14",
        "target": "ras_first_step"
      },
      {
        "id": "e_ras_s16__ras_last_step",
        "source": "ras_s16",
        "target": "ras_last_step"
      },
      {
        "id": "e_ras_first_step__ras_s17",
        "source": "ras_first_step",
        "target": "ras_s17"
      },
      {
        "id": "e_ras_first_step__ras_s18",
        "source": "ras_first_step",
        "target": "ras_s18"
      },
      {
        "id": "e_ras_s15__ras_s18",
        "source": "ras_s15",
        "target": "ras_s18"
      },
      {
        "id": "e_ras_last_step__ras_s18",
        "source": "ras_last_step",
        "target": "ras_s18"
      },
      {
        "id": "e_ras_last_step__ras_s19",
        "source": "ras_last_step",
        "target": "ras_s19"
      },
      {
        "id": "e_ras_s17__ras_s20",
        "source": "ras_s17",
        "target": "ras_s20"
      },
      {
        "id": "e_ras_s18__ras_s21",
        "source": "ras_s18",
        "target": "ras_s21"
      },
      {
        "id": "e_ras_s19__ras_s22",
        "source": "ras_s19",
        "target": "ras_s22"
      },
      {
        "id": "e_ras_s20__ras_step_by_step",
        "source": "ras_s20",
        "target": "ras_step_by_step"
      },
      {
        "id": "e_ras_s22__ras_little_steps",
        "source": "ras_s22",
        "target": "ras_little_steps"
      },
      {
        "id": "e_ras_step_by_step__ras_s23",
        "source": "ras_step_by_step",
        "target": "ras_s23"
      },
      {
        "id": "e_ras_s21__ras_s24",
        "source": "ras_s21",
        "target": "ras_s24"
      },
      {
        "id": "e_ras_little_steps__ras_s25",
        "source": "ras_little_steps",
        "target": "ras_s25"
      },
      {
        "id": "e_ras_s23__ras_grave_step",
        "source": "ras_s23",
        "target": "ras_grave_step"
      },
      {
        "id": "e_ras_s25__ras_side_step",
        "source": "ras_s25",
        "target": "ras_side_step"
      },
      {
        "id": "e_ras_grave_step__ras_t2s01",
        "source": "ras_grave_step",
        "target": "ras_t2s01"
      },
      {
        "id": "e_ras_s23__ras_t2s01",
        "source": "ras_s23",
        "target": "ras_t2s01"
      },
      {
        "id": "e_ras_grave_step__ras_t2s02",
        "source": "ras_grave_step",
        "target": "ras_t2s02"
      },
      {
        "id": "e_ras_s24__ras_t2s02",
        "source": "ras_s24",
        "target": "ras_t2s02"
      },
      {
        "id": "e_ras_side_step__ras_t2s03",
        "source": "ras_side_step",
        "target": "ras_t2s03"
      },
      {
        "id": "e_ras_s24__ras_t2s03",
        "source": "ras_s24",
        "target": "ras_t2s03"
      },
      {
        "id": "e_ras_side_step__ras_t2s04",
        "source": "ras_side_step",
        "target": "ras_t2s04"
      },
      {
        "id": "e_ras_s25__ras_t2s04",
        "source": "ras_s25",
        "target": "ras_t2s04"
      },
      {
        "id": "e_ras_t2s01__ras_hopeful_fall",
        "source": "ras_t2s01",
        "target": "ras_hopeful_fall"
      },
      {
        "id": "e_ras_t2s02__ras_hopeful_reunion",
        "source": "ras_t2s02",
        "target": "ras_hopeful_reunion"
      },
      {
        "id": "e_ras_t2s02__ras_hopeful_fragile",
        "source": "ras_t2s02",
        "target": "ras_hopeful_fragile"
      },
      {
        "id": "e_ras_t2s03__ras_hopeful_fragile",
        "source": "ras_t2s03",
        "target": "ras_hopeful_fragile"
      },
      {
        "id": "e_ras_t2s03__ras_hopeful_void",
        "source": "ras_t2s03",
        "target": "ras_hopeful_void"
      },
      {
        "id": "e_ras_t2s04__ras_hopeful_deceit",
        "source": "ras_t2s04",
        "target": "ras_hopeful_deceit"
      }
    ]
  },
  "reiryoku": {
    "stat": "reiryoku",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "ryk_s01",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s02",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1600
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s03",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s04",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s05",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s06",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1600
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s07",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1500
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s08",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s09",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s10",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s11",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1500
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_inner_hyper",
        "type": "skill",
        "label": "Inner Hyperfixation",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1400
        },
        "description": "Praktyka 'magiczna' twojej rasy przychodzi ci dwukrotnie \u0142atwiej. Zapami\u0119tasz ruchy mechaniczne praktycznie od razu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_high_cost",
        "type": "skill",
        "label": "High Cost",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1400
        },
        "description": "Sztuki 'magii' twojej rasy s\u0105 dla ciebie znacznie \u0142atwiejsze do zrozumienia. Zaczynasz widzie\u0107 struktur\u0119 reishi i reiryoku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s12",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1300
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_inner_hyper"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s13",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1300
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s14",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s15",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1300
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s16",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1300
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_high_cost"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_gold_cannon",
        "type": "skill",
        "label": "Gold Cannon",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1200
        },
        "description": "Utw\u00f3rz szybk\u0105 i lekk\u0105 technik\u0119 na bazie Reiryoku, b\u0105d\u017a ulepsz jedn\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s12",
          "ryk_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_broken_swords",
        "type": "skill",
        "label": "Broken Swords",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1200
        },
        "description": "Utw\u00f3rz powoln\u0105, pot\u0119\u017cn\u0105 technik\u0119 na bazie Reiryoku, b\u0105d\u017a ulepsz jedn\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s15",
          "ryk_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s17",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1100
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_gold_cannon"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s18",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1100
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_gold_cannon"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s19",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1100
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_broken_swords"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s20",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1100
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_broken_swords"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s21",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1000
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s22",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s17",
          "ryk_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s23",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s14",
          "ryk_s18",
          "ryk_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s24",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s19",
          "ryk_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s25",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1000
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_inner_witch",
        "type": "skill",
        "label": "Inner Witch",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 900
        },
        "description": "Tworzenie nowych technik na bazie Reiryoku przychodzi ci szybciej. \u0141atwiej te\u017c ci doprowadzi\u0107, by posiada\u0142y zamierzany przez ciebie efekt.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_magicians_sleeve",
        "type": "skill",
        "label": "Magician's Sleeve",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 900
        },
        "description": "Modyfikacja technik Reiryoku przychodzi ci pro\u015bciej. Zaledwie po kilku pora\u017ckach, zaczynasz ju\u017c rozumie\u0107 zasady.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_tombstone",
        "type": "skill",
        "label": "Tombstone",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "description": "Kiedy kto\u015b ci przekazuje wiedz\u0119, jest trzykrotnie efektywniejszy. Nauka z zapisk\u00f3w od teraz podlicza si\u0119 pod przekazywanie wiedzy.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_legacy_founding",
        "type": "skill",
        "label": "Legacy Founding",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 900
        },
        "description": "Ka\u017cda kolejna nauczona technika z jakiej\u015b tradycji, zwi\u0119ksza efektywno\u015b\u0107 wszystkich technik w danej tradycji o 0.1x.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_s25"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s26",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_inner_witch"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s27",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_magicians_sleeve"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s28",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_s23"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s29",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_tombstone"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_s30",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 700
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_legacy_founding"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_t2s01",
        "type": "stat",
        "label": "+1 RYK",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 1,
        "requires": [
          "ryk_s26"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_t2s02",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_s27"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_t2s03",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_s28"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_t2s04",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_s29"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_t2s05",
        "type": "stat",
        "label": "+2 RYK",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "reiryoku": 1
        },
        "maxPurchases": 2,
        "requires": [
          "ryk_s30"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "ryk_rebel",
        "type": "skill",
        "label": "Reiryoku Rebel",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Reiryoku'. Odrzu\u0107 zwyczaje. Eksperymentuj. Tw\u00f3rz now\u0105 histori\u0119 i ro\u015bnij ponad tafle nieba.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ryk_rebel"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ryk_understanding",
        "type": "skill",
        "label": "Reiryoku Understanding",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Reiryoku'. Analizuj, rozk\u0142adaj na czynniki pierwsze i rozum Reiki, jego i dzia\u0142aj wraz z jego zasadami.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_t2s02",
          "ryk_t2s03",
          "ryk_t2s04"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ryk_understanding"
          }
        ],
        "tags": [
          "hopeful"
        ]
      },
      {
        "id": "ryk_tradition",
        "type": "skill",
        "label": "Reiryoku Tradition",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie innego talentu 'Reiryoku'. Odkop tradycje swoich ras. Kultywuj je. Kontynuuj dziedzictwo.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "ryk_t2s05"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "hopeful"
            ],
            "excludeNodeId": "ryk_tradition"
          }
        ],
        "tags": [
          "hopeful"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_ryk_s01__ryk_s02",
        "source": "ryk_s01",
        "target": "ryk_s02"
      },
      {
        "id": "e_ryk_s01__ryk_s03",
        "source": "ryk_s01",
        "target": "ryk_s03"
      },
      {
        "id": "e_ryk_s01__ryk_s04",
        "source": "ryk_s01",
        "target": "ryk_s04"
      },
      {
        "id": "e_ryk_s01__ryk_s05",
        "source": "ryk_s01",
        "target": "ryk_s05"
      },
      {
        "id": "e_ryk_s01__ryk_s06",
        "source": "ryk_s01",
        "target": "ryk_s06"
      },
      {
        "id": "e_ryk_s02__ryk_s07",
        "source": "ryk_s02",
        "target": "ryk_s07"
      },
      {
        "id": "e_ryk_s03__ryk_s08",
        "source": "ryk_s03",
        "target": "ryk_s08"
      },
      {
        "id": "e_ryk_s04__ryk_s09",
        "source": "ryk_s04",
        "target": "ryk_s09"
      },
      {
        "id": "e_ryk_s05__ryk_s10",
        "source": "ryk_s05",
        "target": "ryk_s10"
      },
      {
        "id": "e_ryk_s06__ryk_s11",
        "source": "ryk_s06",
        "target": "ryk_s11"
      },
      {
        "id": "e_ryk_s07__ryk_inner_hyper",
        "source": "ryk_s07",
        "target": "ryk_inner_hyper"
      },
      {
        "id": "e_ryk_s11__ryk_high_cost",
        "source": "ryk_s11",
        "target": "ryk_high_cost"
      },
      {
        "id": "e_ryk_inner_hyper__ryk_s12",
        "source": "ryk_inner_hyper",
        "target": "ryk_s12"
      },
      {
        "id": "e_ryk_s08__ryk_s13",
        "source": "ryk_s08",
        "target": "ryk_s13"
      },
      {
        "id": "e_ryk_s09__ryk_s14",
        "source": "ryk_s09",
        "target": "ryk_s14"
      },
      {
        "id": "e_ryk_s10__ryk_s15",
        "source": "ryk_s10",
        "target": "ryk_s15"
      },
      {
        "id": "e_ryk_high_cost__ryk_s16",
        "source": "ryk_high_cost",
        "target": "ryk_s16"
      },
      {
        "id": "e_ryk_s12__ryk_gold_cannon",
        "source": "ryk_s12",
        "target": "ryk_gold_cannon"
      },
      {
        "id": "e_ryk_s13__ryk_gold_cannon",
        "source": "ryk_s13",
        "target": "ryk_gold_cannon"
      },
      {
        "id": "e_ryk_s15__ryk_broken_swords",
        "source": "ryk_s15",
        "target": "ryk_broken_swords"
      },
      {
        "id": "e_ryk_s16__ryk_broken_swords",
        "source": "ryk_s16",
        "target": "ryk_broken_swords"
      },
      {
        "id": "e_ryk_gold_cannon__ryk_s17",
        "source": "ryk_gold_cannon",
        "target": "ryk_s17"
      },
      {
        "id": "e_ryk_gold_cannon__ryk_s18",
        "source": "ryk_gold_cannon",
        "target": "ryk_s18"
      },
      {
        "id": "e_ryk_broken_swords__ryk_s19",
        "source": "ryk_broken_swords",
        "target": "ryk_s19"
      },
      {
        "id": "e_ryk_broken_swords__ryk_s20",
        "source": "ryk_broken_swords",
        "target": "ryk_s20"
      },
      {
        "id": "e_ryk_s17__ryk_s21",
        "source": "ryk_s17",
        "target": "ryk_s21"
      },
      {
        "id": "e_ryk_s17__ryk_s22",
        "source": "ryk_s17",
        "target": "ryk_s22"
      },
      {
        "id": "e_ryk_s18__ryk_s22",
        "source": "ryk_s18",
        "target": "ryk_s22"
      },
      {
        "id": "e_ryk_s14__ryk_s23",
        "source": "ryk_s14",
        "target": "ryk_s23"
      },
      {
        "id": "e_ryk_s18__ryk_s23",
        "source": "ryk_s18",
        "target": "ryk_s23"
      },
      {
        "id": "e_ryk_s19__ryk_s23",
        "source": "ryk_s19",
        "target": "ryk_s23"
      },
      {
        "id": "e_ryk_s19__ryk_s24",
        "source": "ryk_s19",
        "target": "ryk_s24"
      },
      {
        "id": "e_ryk_s20__ryk_s24",
        "source": "ryk_s20",
        "target": "ryk_s24"
      },
      {
        "id": "e_ryk_s20__ryk_s25",
        "source": "ryk_s20",
        "target": "ryk_s25"
      },
      {
        "id": "e_ryk_s21__ryk_inner_witch",
        "source": "ryk_s21",
        "target": "ryk_inner_witch"
      },
      {
        "id": "e_ryk_s22__ryk_magicians_sleeve",
        "source": "ryk_s22",
        "target": "ryk_magicians_sleeve"
      },
      {
        "id": "e_ryk_s24__ryk_tombstone",
        "source": "ryk_s24",
        "target": "ryk_tombstone"
      },
      {
        "id": "e_ryk_s25__ryk_legacy_founding",
        "source": "ryk_s25",
        "target": "ryk_legacy_founding"
      },
      {
        "id": "e_ryk_inner_witch__ryk_s26",
        "source": "ryk_inner_witch",
        "target": "ryk_s26"
      },
      {
        "id": "e_ryk_magicians_sleeve__ryk_s27",
        "source": "ryk_magicians_sleeve",
        "target": "ryk_s27"
      },
      {
        "id": "e_ryk_s23__ryk_s28",
        "source": "ryk_s23",
        "target": "ryk_s28"
      },
      {
        "id": "e_ryk_tombstone__ryk_s29",
        "source": "ryk_tombstone",
        "target": "ryk_s29"
      },
      {
        "id": "e_ryk_legacy_founding__ryk_s30",
        "source": "ryk_legacy_founding",
        "target": "ryk_s30"
      },
      {
        "id": "e_ryk_s26__ryk_t2s01",
        "source": "ryk_s26",
        "target": "ryk_t2s01"
      },
      {
        "id": "e_ryk_s27__ryk_t2s02",
        "source": "ryk_s27",
        "target": "ryk_t2s02"
      },
      {
        "id": "e_ryk_s28__ryk_t2s03",
        "source": "ryk_s28",
        "target": "ryk_t2s03"
      },
      {
        "id": "e_ryk_s29__ryk_t2s04",
        "source": "ryk_s29",
        "target": "ryk_t2s04"
      },
      {
        "id": "e_ryk_s30__ryk_t2s05",
        "source": "ryk_s30",
        "target": "ryk_t2s05"
      },
      {
        "id": "e_ryk_t2s01__ryk_rebel",
        "source": "ryk_t2s01",
        "target": "ryk_rebel"
      },
      {
        "id": "e_ryk_t2s02__ryk_understanding",
        "source": "ryk_t2s02",
        "target": "ryk_understanding"
      },
      {
        "id": "e_ryk_t2s03__ryk_understanding",
        "source": "ryk_t2s03",
        "target": "ryk_understanding"
      },
      {
        "id": "e_ryk_t2s04__ryk_understanding",
        "source": "ryk_t2s04",
        "target": "ryk_understanding"
      },
      {
        "id": "e_ryk_t2s05__ryk_tradition",
        "source": "ryk_t2s05",
        "target": "ryk_tradition"
      }
    ]
  },
  "tamashi": {
    "stat": "tamashi",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "tsh_s01",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s02",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s03",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s04",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s05",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s06",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s07",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s08",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s09",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_distant_cry",
        "type": "skill",
        "label": "Distant Cry",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1300
        },
        "description": "Poznaj prawd\u0119 o swojej duszy. Zastosuj j\u0105 w swoich technikach Tamashi. Zaadaptuj jedn\u0105 inn\u0105 posiadan\u0105 technik\u0119.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_soul_string",
        "type": "skill",
        "label": "Soul String",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "description": "Przebud\u017a swoj\u0105 dusz\u0119. Poznaj jej aspekt. Otrzymaj pierwsz\u0105 w prawdzie swoj\u0105 technik\u0119.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_still_soul",
        "type": "skill",
        "label": "Still Soul",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1300
        },
        "description": "Medytacja czasem pozwala ci zajrze\u0107 do swojego wewn\u0119trznego \u015bwiata. Zale\u017cy to od komunikacji z twoj\u0105 dusz\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s08",
          "tsh_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s10",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_distant_cry"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s11",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_soul_string"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s12",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_soul_string"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s13",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_soul_string"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s14",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_still_soul"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s15",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1200
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_still_soul"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_turn_back",
        "type": "skill",
        "label": "Turn Back, Please",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1100
        },
        "description": "Stra\u0107 50% wybranej statystyki na sta\u0142e. Utw\u00f3rz technik\u0119 na bazie Tamashi, nast\u0119pnie ulepsz dwie.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s10",
          "tsh_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s16",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1000
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_turn_back"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s17",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s12",
          "tsh_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s18",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1000
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s13",
          "tsh_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s19",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1000
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s15"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_wrong_way",
        "type": "skill",
        "label": "Wrong Way, Soul",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 900
        },
        "description": "Os\u0142ab swoje techniki Tamashi o 25%, ale zacznij widzie\u0107 ich prawdziwy widok.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_souls_edge",
        "type": "skill",
        "label": "Soul's Edge",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 900
        },
        "description": "Zmniejsz efektywno\u015b\u0107 ca\u0142ego rozwoju Bujutsu, Bukijutsu i Reiryoku dwukrotnie. Zwi\u0119ksz sw\u00f3j rozw\u00f3j Tamashi dwukrotnie.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s20",
        "type": "stat",
        "label": "+2 TSH",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 800
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 2,
        "requires": [
          "tsh_wrong_way"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s21",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 800
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_wrong_way",
          "tsh_s16"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s22",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 800
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s17"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s23",
        "type": "stat",
        "label": "+2 TSH",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 800
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 2,
        "requires": [
          "tsh_souls_edge"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_s24",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 800
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s19"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s01",
        "type": "stat",
        "label": "+2 TSH",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 2,
        "requires": [
          "tsh_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s02",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 2,
        "position": {
          "x": 195,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s03",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s21",
          "tsh_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s04",
        "type": "stat",
        "label": "+2 TSH",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 2,
        "requires": [
          "tsh_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s05",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s23",
          "tsh_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s06",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 2,
        "position": {
          "x": 1365,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_t2s07",
        "type": "stat",
        "label": "+1 TSH",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "tamashi": 1
        },
        "maxPurchases": 1,
        "requires": [
          "tsh_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "tsh_breakthrough",
        "type": "skill",
        "label": "Tamashi Breakthrough",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Poczuj wodze swojej duszy. Pozw\u00f3l jej zdominowa\u0107 pole walki. Uwolnij sw\u00f3j pe\u0142ny potencja\u0142.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "tamashi_top"
            ],
            "excludeNodeId": "tsh_breakthrough"
          }
        ],
        "tags": [
          "tamashi_top"
        ]
      },
      {
        "id": "tsh_fragmented_soul",
        "type": "skill",
        "label": "Fragmented Soul",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 100
        },
        "description": "Gruntownie przebuduj i ulepsz wszystkie swoje techniki na bazie Tamashi.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_t2s02",
          "tsh_t2s03"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "tamashi_top"
            ],
            "excludeNodeId": "tsh_fragmented_soul"
          }
        ],
        "tags": [
          "tamashi_top"
        ]
      },
      {
        "id": "tsh_cycle",
        "type": "skill",
        "label": "Tamashi Cycle",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Wejd\u017a w idealn\u0105 harmoni\u0119 ze swoj\u0105 dusz\u0105. Skontruj si\u0119 z ni\u0105 swoich umiej\u0119tno\u015bci. Pracujcie jak r\u00f3wny z r\u00f3wnym.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_t2s04"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "tamashi_top"
            ],
            "excludeNodeId": "tsh_cycle"
          }
        ],
        "tags": [
          "tamashi_top"
        ]
      },
      {
        "id": "tsh_soul_truth",
        "type": "skill",
        "label": "Soul Truth",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 100
        },
        "description": "Poznaj kolejn\u0105 prawd\u0119. Ulepsz lub stw\u00f3rz now\u0105 technik\u0119 na bazie Tamashi.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_t2s05"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "tamashi_top"
            ],
            "excludeNodeId": "tsh_soul_truth"
          }
        ],
        "tags": [
          "tamashi_top"
        ]
      },
      {
        "id": "tsh_endeavor",
        "type": "skill",
        "label": "Tamashi Endeavor",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Ugnie\u0107 swoj\u0105 dusz\u0119, jak glin\u0119. Dopasuj j\u0105 do swoich potrzeb. Spe\u0142nij swoje pragnienia i pnij na prz\u00f3d.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "tsh_t2s06",
          "tsh_t2s07"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "tamashi_top"
            ],
            "excludeNodeId": "tsh_endeavor"
          }
        ],
        "tags": [
          "tamashi_top"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_tsh_s01__tsh_s02",
        "source": "tsh_s01",
        "target": "tsh_s02"
      },
      {
        "id": "e_tsh_s02__tsh_s03",
        "source": "tsh_s02",
        "target": "tsh_s03"
      },
      {
        "id": "e_tsh_s02__tsh_s04",
        "source": "tsh_s02",
        "target": "tsh_s04"
      },
      {
        "id": "e_tsh_s02__tsh_s05",
        "source": "tsh_s02",
        "target": "tsh_s05"
      },
      {
        "id": "e_tsh_s03__tsh_s06",
        "source": "tsh_s03",
        "target": "tsh_s06"
      },
      {
        "id": "e_tsh_s04__tsh_s07",
        "source": "tsh_s04",
        "target": "tsh_s07"
      },
      {
        "id": "e_tsh_s05__tsh_s08",
        "source": "tsh_s05",
        "target": "tsh_s08"
      },
      {
        "id": "e_tsh_s05__tsh_s09",
        "source": "tsh_s05",
        "target": "tsh_s09"
      },
      {
        "id": "e_tsh_s06__tsh_distant_cry",
        "source": "tsh_s06",
        "target": "tsh_distant_cry"
      },
      {
        "id": "e_tsh_s07__tsh_soul_string",
        "source": "tsh_s07",
        "target": "tsh_soul_string"
      },
      {
        "id": "e_tsh_s08__tsh_still_soul",
        "source": "tsh_s08",
        "target": "tsh_still_soul"
      },
      {
        "id": "e_tsh_s09__tsh_still_soul",
        "source": "tsh_s09",
        "target": "tsh_still_soul"
      },
      {
        "id": "e_tsh_distant_cry__tsh_s10",
        "source": "tsh_distant_cry",
        "target": "tsh_s10"
      },
      {
        "id": "e_tsh_soul_string__tsh_s11",
        "source": "tsh_soul_string",
        "target": "tsh_s11"
      },
      {
        "id": "e_tsh_soul_string__tsh_s12",
        "source": "tsh_soul_string",
        "target": "tsh_s12"
      },
      {
        "id": "e_tsh_soul_string__tsh_s13",
        "source": "tsh_soul_string",
        "target": "tsh_s13"
      },
      {
        "id": "e_tsh_still_soul__tsh_s14",
        "source": "tsh_still_soul",
        "target": "tsh_s14"
      },
      {
        "id": "e_tsh_still_soul__tsh_s15",
        "source": "tsh_still_soul",
        "target": "tsh_s15"
      },
      {
        "id": "e_tsh_s10__tsh_turn_back",
        "source": "tsh_s10",
        "target": "tsh_turn_back"
      },
      {
        "id": "e_tsh_s11__tsh_turn_back",
        "source": "tsh_s11",
        "target": "tsh_turn_back"
      },
      {
        "id": "e_tsh_turn_back__tsh_s16",
        "source": "tsh_turn_back",
        "target": "tsh_s16"
      },
      {
        "id": "e_tsh_s12__tsh_s17",
        "source": "tsh_s12",
        "target": "tsh_s17"
      },
      {
        "id": "e_tsh_s13__tsh_s17",
        "source": "tsh_s13",
        "target": "tsh_s17"
      },
      {
        "id": "e_tsh_s13__tsh_s18",
        "source": "tsh_s13",
        "target": "tsh_s18"
      },
      {
        "id": "e_tsh_s14__tsh_s18",
        "source": "tsh_s14",
        "target": "tsh_s18"
      },
      {
        "id": "e_tsh_s15__tsh_s19",
        "source": "tsh_s15",
        "target": "tsh_s19"
      },
      {
        "id": "e_tsh_s16__tsh_wrong_way",
        "source": "tsh_s16",
        "target": "tsh_wrong_way"
      },
      {
        "id": "e_tsh_s18__tsh_souls_edge",
        "source": "tsh_s18",
        "target": "tsh_souls_edge"
      },
      {
        "id": "e_tsh_wrong_way__tsh_s20",
        "source": "tsh_wrong_way",
        "target": "tsh_s20"
      },
      {
        "id": "e_tsh_wrong_way__tsh_s21",
        "source": "tsh_wrong_way",
        "target": "tsh_s21"
      },
      {
        "id": "e_tsh_s16__tsh_s21",
        "source": "tsh_s16",
        "target": "tsh_s21"
      },
      {
        "id": "e_tsh_s17__tsh_s22",
        "source": "tsh_s17",
        "target": "tsh_s22"
      },
      {
        "id": "e_tsh_souls_edge__tsh_s23",
        "source": "tsh_souls_edge",
        "target": "tsh_s23"
      },
      {
        "id": "e_tsh_s19__tsh_s24",
        "source": "tsh_s19",
        "target": "tsh_s24"
      },
      {
        "id": "e_tsh_s20__tsh_t2s01",
        "source": "tsh_s20",
        "target": "tsh_t2s01"
      },
      {
        "id": "e_tsh_s21__tsh_t2s02",
        "source": "tsh_s21",
        "target": "tsh_t2s02"
      },
      {
        "id": "e_tsh_s21__tsh_t2s03",
        "source": "tsh_s21",
        "target": "tsh_t2s03"
      },
      {
        "id": "e_tsh_s22__tsh_t2s03",
        "source": "tsh_s22",
        "target": "tsh_t2s03"
      },
      {
        "id": "e_tsh_s22__tsh_t2s04",
        "source": "tsh_s22",
        "target": "tsh_t2s04"
      },
      {
        "id": "e_tsh_s23__tsh_t2s05",
        "source": "tsh_s23",
        "target": "tsh_t2s05"
      },
      {
        "id": "e_tsh_s24__tsh_t2s05",
        "source": "tsh_s24",
        "target": "tsh_t2s05"
      },
      {
        "id": "e_tsh_s24__tsh_t2s06",
        "source": "tsh_s24",
        "target": "tsh_t2s06"
      },
      {
        "id": "e_tsh_s24__tsh_t2s07",
        "source": "tsh_s24",
        "target": "tsh_t2s07"
      },
      {
        "id": "e_tsh_t2s01__tsh_breakthrough",
        "source": "tsh_t2s01",
        "target": "tsh_breakthrough"
      },
      {
        "id": "e_tsh_t2s02__tsh_fragmented_soul",
        "source": "tsh_t2s02",
        "target": "tsh_fragmented_soul"
      },
      {
        "id": "e_tsh_t2s03__tsh_fragmented_soul",
        "source": "tsh_t2s03",
        "target": "tsh_fragmented_soul"
      },
      {
        "id": "e_tsh_t2s04__tsh_cycle",
        "source": "tsh_t2s04",
        "target": "tsh_cycle"
      },
      {
        "id": "e_tsh_t2s05__tsh_soul_truth",
        "source": "tsh_t2s05",
        "target": "tsh_soul_truth"
      },
      {
        "id": "e_tsh_t2s06__tsh_endeavor",
        "source": "tsh_t2s06",
        "target": "tsh_endeavor"
      },
      {
        "id": "e_tsh_t2s07__tsh_endeavor",
        "source": "tsh_t2s07",
        "target": "tsh_endeavor"
      }
    ]
  },
  "bujutsu": {
    "stat": "bujutsu",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "buj_s01",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s02",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s03",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s04",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s05",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s06",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s07",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s08",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s09",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s10",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_many_hands",
        "type": "skill",
        "label": "Many Hands",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1300
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Hidden Hand'. Stw\u00f3rz pasywny styl walki, kt\u00f3ry modyfikuje twoje ataki podstawowe bez broni.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s10"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_hidden_hand"
            ],
            "excludeNodeId": "buj_many_hands"
          }
        ],
        "tags": [
          "buj_many_hands"
        ]
      },
      {
        "id": "buj_hidden_hand",
        "type": "skill",
        "label": "Hidden Hand",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1300
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Many Hands'. Stw\u00f3rz styl walki i podstawow\u0105 technik\u0119 do tego stylu walki.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s08"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_many_hands"
            ],
            "excludeNodeId": "buj_hidden_hand"
          }
        ],
        "tags": [
          "buj_hidden_hand"
        ]
      },
      {
        "id": "buj_s11",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1200
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s12",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 390,
          "y": 1200
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_hidden_hand",
          "buj_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s13",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1200
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s14",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 1170,
          "y": 1200
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_many_hands",
          "buj_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s15",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1200
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_stepping_stone",
        "type": "skill",
        "label": "Stepping Stone",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 1100
        },
        "description": "Pozwala ulepszy\u0107 technik\u0119 stylu walki.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_cruel_training",
        "type": "skill",
        "label": "Cruel Training",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 1100
        },
        "description": "Na pocz\u0105tku tury mo\u017cesz zap\u0142aci\u0107 5% maks. \u017cycia, by wykona\u0107 o jeden atak podstawowy wi\u0119cej.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s15"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s16",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 1000
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_stepping_stone",
          "buj_s12"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s17",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1000
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s12",
          "buj_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s18",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s19",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1000
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_s13",
          "buj_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s20",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 1000
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_cruel_training",
          "buj_s14"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_wish_tomorrow",
        "type": "skill",
        "label": "Wish of Tomorrow",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 900
        },
        "description": "Mo\u017cesz wzi\u0105\u0107 jedynie 2 talenty 'of Tomorrow'. Zyskujesz technik\u0119 na bazie stylu walki. Tw\u00f3j styl walki otrzymuje wybrane skalowanie.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s16",
          "buj_s17"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_of_tomorrow"
            ],
            "maxTagCount": 2
          }
        ],
        "tags": [
          "buj_of_tomorrow"
        ]
      },
      {
        "id": "buj_cry_tomorrow",
        "type": "skill",
        "label": "Cry of Tomorrow",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 900
        },
        "description": "Mo\u017cesz wzi\u0105\u0107 jedynie 2 talenty 'of Tomorrow'. Im bardziej jeste\u015b ranny, tym wi\u0119cej obra\u017ce\u0144 zadajesz. Im bardziej ranni s\u0105 towarzysze, tym mniej obra\u017ce\u0144 otrzymujesz (do -25%).",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s19",
          "buj_s20"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_of_tomorrow"
            ],
            "maxTagCount": 2
          }
        ],
        "tags": [
          "buj_of_tomorrow"
        ]
      },
      {
        "id": "buj_horror_tomorrow",
        "type": "skill",
        "label": "Horror of Tomorrow",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 900
        },
        "description": "Mo\u017cesz wzi\u0105\u0107 jedynie 2 talenty 'of Tomorrow'. Twoja psychika spada dwukrotnie szybciej, ale tw\u00f3j styl walki wzbudza terror, i styl walki zostaje ulepszony.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s16"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_of_tomorrow"
            ],
            "maxTagCount": 2
          }
        ],
        "tags": [
          "buj_of_tomorrow"
        ]
      },
      {
        "id": "buj_sacrifice_tomorrow",
        "type": "skill",
        "label": "Sacrifice of Tomorrow",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 900
        },
        "description": "Mo\u017cesz wzi\u0105\u0107 jedynie 2 talenty 'of Tomorrow'. Permanentne obra\u017cenia wzmacniaj\u0105 styl walki. Otrzymywanie negatywnych mno\u017cnik\u00f3w rozwija styl walki.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_s20"
        ],
        "blocks": [
          {
            "tree": "bujutsu",
            "tags": [
              "buj_of_tomorrow"
            ],
            "maxTagCount": 2
          }
        ],
        "tags": [
          "buj_of_tomorrow"
        ]
      },
      {
        "id": "buj_s21",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 800
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_horror_tomorrow",
          "buj_wish_tomorrow"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s22",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 800
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_wish_tomorrow"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s23",
        "type": "stat",
        "label": "+2 BUJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 800
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "buj_s18",
          "buj_wish_tomorrow",
          "buj_cry_tomorrow"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s24",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 800
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_cry_tomorrow"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_s25",
        "type": "stat",
        "label": "+1 BUJ",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 800
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "buj_sacrifice_tomorrow",
          "buj_cry_tomorrow"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_t2s01",
        "type": "stat",
        "label": "+2 BUJ",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "buj_s21"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_t2s02",
        "type": "stat",
        "label": "+2 BUJ",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "buj_s22",
          "buj_s23",
          "buj_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_t2s03",
        "type": "stat",
        "label": "+2 BUJ",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "bujutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "buj_s25"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "buj_brute",
        "type": "skill",
        "label": "Bujutsu Brute",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Tw\u00f3j styl walki ulega zmianie. Od teraz twoje ciosy s\u0105 silniejsze, a tw\u00f3j styl \u0142atwiej og\u0142usza i niszczy barykady. Skalowanie z Si\u0142\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bujutsu_top"
            ],
            "excludeNodeId": "buj_brute"
          }
        ],
        "tags": [
          "bujutsu_top"
        ]
      },
      {
        "id": "buj_soul",
        "type": "skill",
        "label": "Bujutsu Soul",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Tw\u00f3j styl walki ulega zmianie. Tw\u00f3j styl walki zaczyna skalowa\u0107 si\u0119 z Reiryoku.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_t2s02"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bujutsu_top"
            ],
            "excludeNodeId": "buj_soul"
          }
        ],
        "tags": [
          "bujutsu_top"
        ]
      },
      {
        "id": "buj_open_hand",
        "type": "skill",
        "label": "Bujutsu Open Hand",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Tw\u00f3j styl walki ulega zmianie. Od teraz mo\u017cesz \u0142atwiej przekierowywa\u0107 ataki dystansowe. Tw\u00f3j styl zaczyna skalowa\u0107 si\u0119 z Obron\u0105.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "buj_t2s03"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bujutsu_top"
            ],
            "excludeNodeId": "buj_open_hand"
          }
        ],
        "tags": [
          "bujutsu_top"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_buj_s01__buj_s02",
        "source": "buj_s01",
        "target": "buj_s02"
      },
      {
        "id": "e_buj_s01__buj_s03",
        "source": "buj_s01",
        "target": "buj_s03"
      },
      {
        "id": "e_buj_s01__buj_s04",
        "source": "buj_s01",
        "target": "buj_s04"
      },
      {
        "id": "e_buj_s02__buj_s05",
        "source": "buj_s02",
        "target": "buj_s05"
      },
      {
        "id": "e_buj_s03__buj_s06",
        "source": "buj_s03",
        "target": "buj_s06"
      },
      {
        "id": "e_buj_s04__buj_s07",
        "source": "buj_s04",
        "target": "buj_s07"
      },
      {
        "id": "e_buj_s05__buj_s08",
        "source": "buj_s05",
        "target": "buj_s08"
      },
      {
        "id": "e_buj_s06__buj_s09",
        "source": "buj_s06",
        "target": "buj_s09"
      },
      {
        "id": "e_buj_s07__buj_s10",
        "source": "buj_s07",
        "target": "buj_s10"
      },
      {
        "id": "e_buj_s10__buj_many_hands",
        "source": "buj_s10",
        "target": "buj_many_hands"
      },
      {
        "id": "e_buj_s08__buj_hidden_hand",
        "source": "buj_s08",
        "target": "buj_hidden_hand"
      },
      {
        "id": "e_buj_s08__buj_s11",
        "source": "buj_s08",
        "target": "buj_s11"
      },
      {
        "id": "e_buj_hidden_hand__buj_s12",
        "source": "buj_hidden_hand",
        "target": "buj_s12"
      },
      {
        "id": "e_buj_s09__buj_s12",
        "source": "buj_s09",
        "target": "buj_s12"
      },
      {
        "id": "e_buj_s09__buj_s13",
        "source": "buj_s09",
        "target": "buj_s13"
      },
      {
        "id": "e_buj_many_hands__buj_s14",
        "source": "buj_many_hands",
        "target": "buj_s14"
      },
      {
        "id": "e_buj_s09__buj_s14",
        "source": "buj_s09",
        "target": "buj_s14"
      },
      {
        "id": "e_buj_s10__buj_s15",
        "source": "buj_s10",
        "target": "buj_s15"
      },
      {
        "id": "e_buj_s11__buj_stepping_stone",
        "source": "buj_s11",
        "target": "buj_stepping_stone"
      },
      {
        "id": "e_buj_s15__buj_cruel_training",
        "source": "buj_s15",
        "target": "buj_cruel_training"
      },
      {
        "id": "e_buj_stepping_stone__buj_s16",
        "source": "buj_stepping_stone",
        "target": "buj_s16"
      },
      {
        "id": "e_buj_s12__buj_s16",
        "source": "buj_s12",
        "target": "buj_s16"
      },
      {
        "id": "e_buj_s12__buj_s17",
        "source": "buj_s12",
        "target": "buj_s17"
      },
      {
        "id": "e_buj_s13__buj_s17",
        "source": "buj_s13",
        "target": "buj_s17"
      },
      {
        "id": "e_buj_s13__buj_s18",
        "source": "buj_s13",
        "target": "buj_s18"
      },
      {
        "id": "e_buj_s13__buj_s19",
        "source": "buj_s13",
        "target": "buj_s19"
      },
      {
        "id": "e_buj_s14__buj_s19",
        "source": "buj_s14",
        "target": "buj_s19"
      },
      {
        "id": "e_buj_cruel_training__buj_s20",
        "source": "buj_cruel_training",
        "target": "buj_s20"
      },
      {
        "id": "e_buj_s14__buj_s20",
        "source": "buj_s14",
        "target": "buj_s20"
      },
      {
        "id": "e_buj_s16__buj_wish_tomorrow",
        "source": "buj_s16",
        "target": "buj_wish_tomorrow"
      },
      {
        "id": "e_buj_s17__buj_wish_tomorrow",
        "source": "buj_s17",
        "target": "buj_wish_tomorrow"
      },
      {
        "id": "e_buj_s19__buj_cry_tomorrow",
        "source": "buj_s19",
        "target": "buj_cry_tomorrow"
      },
      {
        "id": "e_buj_s20__buj_cry_tomorrow",
        "source": "buj_s20",
        "target": "buj_cry_tomorrow"
      },
      {
        "id": "e_buj_s16__buj_horror_tomorrow",
        "source": "buj_s16",
        "target": "buj_horror_tomorrow"
      },
      {
        "id": "e_buj_s20__buj_sacrifice_tomorrow",
        "source": "buj_s20",
        "target": "buj_sacrifice_tomorrow"
      },
      {
        "id": "e_buj_horror_tomorrow__buj_s21",
        "source": "buj_horror_tomorrow",
        "target": "buj_s21"
      },
      {
        "id": "e_buj_wish_tomorrow__buj_s21",
        "source": "buj_wish_tomorrow",
        "target": "buj_s21"
      },
      {
        "id": "e_buj_wish_tomorrow__buj_s22",
        "source": "buj_wish_tomorrow",
        "target": "buj_s22"
      },
      {
        "id": "e_buj_s18__buj_s23",
        "source": "buj_s18",
        "target": "buj_s23"
      },
      {
        "id": "e_buj_wish_tomorrow__buj_s23",
        "source": "buj_wish_tomorrow",
        "target": "buj_s23"
      },
      {
        "id": "e_buj_cry_tomorrow__buj_s23",
        "source": "buj_cry_tomorrow",
        "target": "buj_s23"
      },
      {
        "id": "e_buj_cry_tomorrow__buj_s24",
        "source": "buj_cry_tomorrow",
        "target": "buj_s24"
      },
      {
        "id": "e_buj_sacrifice_tomorrow__buj_s25",
        "source": "buj_sacrifice_tomorrow",
        "target": "buj_s25"
      },
      {
        "id": "e_buj_cry_tomorrow__buj_s25",
        "source": "buj_cry_tomorrow",
        "target": "buj_s25"
      },
      {
        "id": "e_buj_s21__buj_t2s01",
        "source": "buj_s21",
        "target": "buj_t2s01"
      },
      {
        "id": "e_buj_s22__buj_t2s02",
        "source": "buj_s22",
        "target": "buj_t2s02"
      },
      {
        "id": "e_buj_s23__buj_t2s02",
        "source": "buj_s23",
        "target": "buj_t2s02"
      },
      {
        "id": "e_buj_s24__buj_t2s02",
        "source": "buj_s24",
        "target": "buj_t2s02"
      },
      {
        "id": "e_buj_s25__buj_t2s03",
        "source": "buj_s25",
        "target": "buj_t2s03"
      },
      {
        "id": "e_buj_t2s01__buj_brute",
        "source": "buj_t2s01",
        "target": "buj_brute"
      },
      {
        "id": "e_buj_t2s02__buj_soul",
        "source": "buj_t2s02",
        "target": "buj_soul"
      },
      {
        "id": "e_buj_t2s03__buj_open_hand",
        "source": "buj_t2s03",
        "target": "buj_open_hand"
      }
    ]
  },
  "bukijutsu": {
    "stat": "bukijutsu",
    "isDefault": true,
    "characterId": null,
    "nodes": [
      {
        "id": "bkj_s01",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1700
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s02",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s03",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s04",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s01"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s05",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1500
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s02"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s06",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1500
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s03"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s07",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1500
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s04"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s08",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s05"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s09",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s06"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s10",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s07"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_grindstone",
        "type": "skill",
        "label": "Grindstone",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1300
        },
        "description": "Pozwala utworzy\u0107 lub ulepszy\u0107 technik\u0119 na bazie Bukijutsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s09"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_pact",
        "type": "skill",
        "label": "Pact",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1200
        },
        "description": "Wybierz jeden konkretny typ broni. Nie mo\u017cesz u\u017cywa\u0107 od tej pory innych, ale wszystkie techniki Bukijutsu zyskuj\u0105 +25% obra\u017ce\u0144.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s08"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_monkeys_paw",
        "type": "skill",
        "label": "Monkey's Paw",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1200
        },
        "description": "Utw\u00f3rz specjalny rytua\u0142/tradycj\u0119. Wykonanie jej przed walk\u0105, daje ci bonusy do technik Bukijutsu, za okre\u015blony koszt.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s10"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s11",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 1100
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_pact"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s12",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1100
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_grindstone"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s13",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 1100
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_monkeys_paw"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_guidepost",
        "type": "skill",
        "label": "Guidepost",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 1000
        },
        "description": "Wybierz atut dla swojego stylu walki Bukijutsu. Wzmocnij nim wszystkie aktualne i przysz\u0142e techniki Bukijutsu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s11",
          "bkj_s12",
          "bkj_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s14",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 900
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s11"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s15",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 900
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_guidepost"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s16",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 900
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_guidepost"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s17",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 900
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s13"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_heavy_pressure",
        "type": "skill",
        "label": "Heavy Pressure",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 800
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Feather-Like'. Raz na 5 tur, wybrana technika Bukijutsu zyskuje podw\u00f3jn\u0105 szybko\u015b\u0107 lub dystansowa podw\u00f3jn\u0105 celno\u015b\u0107.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s14"
        ],
        "blocks": [
          {
            "tree": "bukijutsu",
            "tags": [
              "bkj_feather_like"
            ],
            "excludeNodeId": "bkj_heavy_pressure"
          }
        ],
        "tags": [
          "bkj_heavy_pressure"
        ]
      },
      {
        "id": "bkj_feather_like",
        "type": "skill",
        "label": "Feather-Like",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 800
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Heavy Pressure'. Przy ka\u017cdej aktywacji techniki Bukijutsu mo\u017cesz zrobi\u0107 dodatkow\u0105 darmow\u0105 akcj\u0119 ruchu.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s15"
        ],
        "blocks": [
          {
            "tree": "bukijutsu",
            "tags": [
              "bkj_heavy_pressure"
            ],
            "excludeNodeId": "bkj_feather_like"
          }
        ],
        "tags": [
          "bkj_feather_like"
        ]
      },
      {
        "id": "bkj_stone_rain",
        "type": "skill",
        "label": "Stone Rain",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 800
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Leaf on Surface'. U\u017cywanie technik Bukijutsu z rz\u0119du zwi\u0119ksza si\u0142\u0119 (+0.1x za ka\u017cd\u0105). Efekt tracony po u\u017cyciu innych technik.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s16"
        ],
        "blocks": [
          {
            "tree": "bukijutsu",
            "tags": [
              "bkj_leaf_on_surface"
            ],
            "excludeNodeId": "bkj_stone_rain"
          }
        ],
        "tags": [
          "bkj_stone_rain"
        ]
      },
      {
        "id": "bkj_leaf_on_surface",
        "type": "skill",
        "label": "Leaf on Surface",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 800
        },
        "description": "Uniemo\u017cliwia wzi\u0119cie 'Stone Rain'. Ka\u017cda tura bez techniki Bukijutsu zwi\u0119ksza si\u0142\u0119 nast\u0119pnej u\u017cytej techniki.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_s17"
        ],
        "blocks": [
          {
            "tree": "bukijutsu",
            "tags": [
              "bkj_stone_rain"
            ],
            "excludeNodeId": "bkj_leaf_on_surface"
          }
        ],
        "tags": [
          "bkj_leaf_on_surface"
        ]
      },
      {
        "id": "bkj_s18",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 1,
        "position": {
          "x": 0,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_heavy_pressure"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s19",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 195,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_heavy_pressure",
          "bkj_feather_like"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s20",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 1,
        "position": {
          "x": 585,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_feather_like"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s21",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 780,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_feather_like",
          "bkj_stone_rain"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s22",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 1,
        "position": {
          "x": 975,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_stone_rain",
          "bkj_leaf_on_surface"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s23",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 1,
        "position": {
          "x": 1365,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_leaf_on_surface"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_s24",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 1,
        "position": {
          "x": 1560,
          "y": 600
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_leaf_on_surface"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_t2s01",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_s18"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_t2s02",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 2,
        "position": {
          "x": 390,
          "y": 400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s19",
          "bkj_s20"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_t2s03",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_s21",
          "bkj_s22"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_t2s04",
        "type": "stat",
        "label": "+1 BKJ",
        "tier": 2,
        "position": {
          "x": 1170,
          "y": 400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 1,
        "requires": [
          "bkj_s22",
          "bkj_s23"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_t2s05",
        "type": "stat",
        "label": "+2 BKJ",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 400
        },
        "statGrants": {
          "bukijutsu": 1
        },
        "maxPurchases": 2,
        "requires": [
          "bkj_s24"
        ],
        "blocks": [],
        "tags": []
      },
      {
        "id": "bkj_master",
        "type": "skill",
        "label": "Bukijutsu Master",
        "tier": 2,
        "position": {
          "x": 0,
          "y": 100
        },
        "description": "Po\u0142\u0105cz wszystkie swoje techniki Bukijutsu w jedn\u0105. Je\u015bli masz tylko jedn\u0105, znacznie j\u0105 ulepsz.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_t2s01"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bukijutsu_top"
            ],
            "excludeNodeId": "bkj_master"
          }
        ],
        "tags": [
          "bukijutsu_top"
        ]
      },
      {
        "id": "bkj_harmony",
        "type": "skill",
        "label": "Bukijutsu Harmony",
        "tier": 2,
        "position": {
          "x": 780,
          "y": 100
        },
        "description": "Tw\u00f3j styl walki staje si\u0119 idealnie skomponowany z twoj\u0105 dusz\u0105. Wybrana technika Bukijutsu/Tamashi zwi\u0119ksza ich efektywno\u015b\u0107.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_t2s02",
          "bkj_t2s03",
          "bkj_t2s04"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bukijutsu_top"
            ],
            "excludeNodeId": "bkj_harmony"
          }
        ],
        "tags": [
          "bukijutsu_top"
        ]
      },
      {
        "id": "bkj_hundred_aces",
        "type": "skill",
        "label": "Bukijutsu Hundred Aces",
        "tier": 2,
        "position": {
          "x": 1560,
          "y": 100
        },
        "description": "Utw\u00f3rz dwie nowe techniki Bukijutsu. Wszystkie techniki Bukijutsu mog\u0105 by\u0107 u\u017cywane z dwukrotn\u0105 cz\u0119stotliwo\u015bci\u0105, ale s\u0105 o 25% s\u0142absze.",
        "statGrants": {},
        "maxPurchases": 1,
        "requires": [
          "bkj_t2s05"
        ],
        "blocks": [
          {
            "tree": "*",
            "tags": [
              "bukijutsu_top"
            ],
            "excludeNodeId": "bkj_hundred_aces"
          }
        ],
        "tags": [
          "bukijutsu_top"
        ]
      }
    ],
    "edges": [
      {
        "id": "e_bkj_s01__bkj_s02",
        "source": "bkj_s01",
        "target": "bkj_s02"
      },
      {
        "id": "e_bkj_s01__bkj_s03",
        "source": "bkj_s01",
        "target": "bkj_s03"
      },
      {
        "id": "e_bkj_s01__bkj_s04",
        "source": "bkj_s01",
        "target": "bkj_s04"
      },
      {
        "id": "e_bkj_s02__bkj_s05",
        "source": "bkj_s02",
        "target": "bkj_s05"
      },
      {
        "id": "e_bkj_s03__bkj_s06",
        "source": "bkj_s03",
        "target": "bkj_s06"
      },
      {
        "id": "e_bkj_s04__bkj_s07",
        "source": "bkj_s04",
        "target": "bkj_s07"
      },
      {
        "id": "e_bkj_s05__bkj_s08",
        "source": "bkj_s05",
        "target": "bkj_s08"
      },
      {
        "id": "e_bkj_s06__bkj_s09",
        "source": "bkj_s06",
        "target": "bkj_s09"
      },
      {
        "id": "e_bkj_s07__bkj_s10",
        "source": "bkj_s07",
        "target": "bkj_s10"
      },
      {
        "id": "e_bkj_s09__bkj_grindstone",
        "source": "bkj_s09",
        "target": "bkj_grindstone"
      },
      {
        "id": "e_bkj_s08__bkj_pact",
        "source": "bkj_s08",
        "target": "bkj_pact"
      },
      {
        "id": "e_bkj_s10__bkj_monkeys_paw",
        "source": "bkj_s10",
        "target": "bkj_monkeys_paw"
      },
      {
        "id": "e_bkj_pact__bkj_s11",
        "source": "bkj_pact",
        "target": "bkj_s11"
      },
      {
        "id": "e_bkj_grindstone__bkj_s12",
        "source": "bkj_grindstone",
        "target": "bkj_s12"
      },
      {
        "id": "e_bkj_monkeys_paw__bkj_s13",
        "source": "bkj_monkeys_paw",
        "target": "bkj_s13"
      },
      {
        "id": "e_bkj_s11__bkj_guidepost",
        "source": "bkj_s11",
        "target": "bkj_guidepost"
      },
      {
        "id": "e_bkj_s12__bkj_guidepost",
        "source": "bkj_s12",
        "target": "bkj_guidepost"
      },
      {
        "id": "e_bkj_s13__bkj_guidepost",
        "source": "bkj_s13",
        "target": "bkj_guidepost"
      },
      {
        "id": "e_bkj_s11__bkj_s14",
        "source": "bkj_s11",
        "target": "bkj_s14"
      },
      {
        "id": "e_bkj_guidepost__bkj_s15",
        "source": "bkj_guidepost",
        "target": "bkj_s15"
      },
      {
        "id": "e_bkj_guidepost__bkj_s16",
        "source": "bkj_guidepost",
        "target": "bkj_s16"
      },
      {
        "id": "e_bkj_s13__bkj_s17",
        "source": "bkj_s13",
        "target": "bkj_s17"
      },
      {
        "id": "e_bkj_s14__bkj_heavy_pressure",
        "source": "bkj_s14",
        "target": "bkj_heavy_pressure"
      },
      {
        "id": "e_bkj_s15__bkj_feather_like",
        "source": "bkj_s15",
        "target": "bkj_feather_like"
      },
      {
        "id": "e_bkj_s16__bkj_stone_rain",
        "source": "bkj_s16",
        "target": "bkj_stone_rain"
      },
      {
        "id": "e_bkj_s17__bkj_leaf_on_surface",
        "source": "bkj_s17",
        "target": "bkj_leaf_on_surface"
      },
      {
        "id": "e_bkj_heavy_pressure__bkj_s18",
        "source": "bkj_heavy_pressure",
        "target": "bkj_s18"
      },
      {
        "id": "e_bkj_heavy_pressure__bkj_s19",
        "source": "bkj_heavy_pressure",
        "target": "bkj_s19"
      },
      {
        "id": "e_bkj_feather_like__bkj_s19",
        "source": "bkj_feather_like",
        "target": "bkj_s19"
      },
      {
        "id": "e_bkj_feather_like__bkj_s20",
        "source": "bkj_feather_like",
        "target": "bkj_s20"
      },
      {
        "id": "e_bkj_feather_like__bkj_s21",
        "source": "bkj_feather_like",
        "target": "bkj_s21"
      },
      {
        "id": "e_bkj_stone_rain__bkj_s21",
        "source": "bkj_stone_rain",
        "target": "bkj_s21"
      },
      {
        "id": "e_bkj_stone_rain__bkj_s22",
        "source": "bkj_stone_rain",
        "target": "bkj_s22"
      },
      {
        "id": "e_bkj_leaf_on_surface__bkj_s22",
        "source": "bkj_leaf_on_surface",
        "target": "bkj_s22"
      },
      {
        "id": "e_bkj_leaf_on_surface__bkj_s23",
        "source": "bkj_leaf_on_surface",
        "target": "bkj_s23"
      },
      {
        "id": "e_bkj_leaf_on_surface__bkj_s24",
        "source": "bkj_leaf_on_surface",
        "target": "bkj_s24"
      },
      {
        "id": "e_bkj_s18__bkj_t2s01",
        "source": "bkj_s18",
        "target": "bkj_t2s01"
      },
      {
        "id": "e_bkj_s19__bkj_t2s02",
        "source": "bkj_s19",
        "target": "bkj_t2s02"
      },
      {
        "id": "e_bkj_s20__bkj_t2s02",
        "source": "bkj_s20",
        "target": "bkj_t2s02"
      },
      {
        "id": "e_bkj_s21__bkj_t2s03",
        "source": "bkj_s21",
        "target": "bkj_t2s03"
      },
      {
        "id": "e_bkj_s22__bkj_t2s03",
        "source": "bkj_s22",
        "target": "bkj_t2s03"
      },
      {
        "id": "e_bkj_s22__bkj_t2s04",
        "source": "bkj_s22",
        "target": "bkj_t2s04"
      },
      {
        "id": "e_bkj_s23__bkj_t2s04",
        "source": "bkj_s23",
        "target": "bkj_t2s04"
      },
      {
        "id": "e_bkj_s24__bkj_t2s05",
        "source": "bkj_s24",
        "target": "bkj_t2s05"
      },
      {
        "id": "e_bkj_t2s01__bkj_master",
        "source": "bkj_t2s01",
        "target": "bkj_master"
      },
      {
        "id": "e_bkj_t2s02__bkj_harmony",
        "source": "bkj_t2s02",
        "target": "bkj_harmony"
      },
      {
        "id": "e_bkj_t2s03__bkj_harmony",
        "source": "bkj_t2s03",
        "target": "bkj_harmony"
      },
      {
        "id": "e_bkj_t2s04__bkj_harmony",
        "source": "bkj_t2s04",
        "target": "bkj_harmony"
      },
      {
        "id": "e_bkj_t2s05__bkj_hundred_aces",
        "source": "bkj_t2s05",
        "target": "bkj_hundred_aces"
      }
    ]
  }
};

export const NAZO_TREE_TEMPLATE = {
  stat: 'nazo',
  isDefault: false,
  characterId: null,
  nodes: [],
  edges: [],
};

export function buildEdges(nodes) {
  const edges = [];
  for (const node of nodes) {
    for (const reqId of (node.requires || [])) {
      edges.push({ id: `e_${reqId}__${node.id}`, source: reqId, target: node.id });
    }
  }
  return edges;
}
