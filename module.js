Hooks.once('init', () => {
  console.log('VTM Random Enemy Generator инициализирован!');
  Handlebars.registerHelper('capitalize', function (str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
});

Hooks.on('getSceneControlButtons', (controls) => {
  const tool = {
    name: 'generate-vtm-enemy',
    title: game.i18n.localize('VTMRE.ButtonTitle'),
    icon: 'fas fa-skull',
    visible: true,
    button: true,
    onChange: () => new RandomEnemyPreview().render(true)
  };

  // v13+: controls и tools — объекты, а не массивы
  const group = controls.tokens;
  if (group) group.tools[tool.name] = { ...tool, order: Object.keys(group.tools).length };
});

class RandomEnemyPreview extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'random-enemy-preview',
      title: game.i18n.localize('VTMRE.PreviewTitle'),
      template: 'modules/vtm-random-enemy/templates/preview.html',
      width: 600,
      height: 800,
      resizable: true
    });
  }

  constructor() {
    super();
    this.difficulty = 'medium';
  }

  getData() {
    const clans = ['Brujah', 'Gangrel', 'Malkavian', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue'];
    const disciplinesList = [
      'Animalism', 'Auspex', 'Celerity', 'Dominate', 'Fortitude', 'Obfuscate', 
      'Potence', 'Presence', 'Protean', 'Sorcery', 'Oblivion'
    ];
    const predatorTypes = {
      'Alleycat': { skills: { brawl: 2, intimidation: 1 }, disciplines: ['Potence'] },
      'Bagger': { skills: { larceny: 2, stealth: 1 }, disciplines: ['Obfuscate'] },
      'Blood Leech': { skills: { brawl: 2, stealth: 1 }, disciplines: ['Protean'], humanity: -1 },
      'Cleaver': { skills: { persuasion: 2, subterfuge: 1 }, disciplines: ['Dominate'] },
      'Consensualist': { skills: { persuasion: 2, insight: 1 }, disciplines: ['Presence'], humanity: 1 },
      'Farmer': { skills: { animalken: 2, survival: 1 }, disciplines: ['Animalism'], humanity: 1 },
      'Sandman': { skills: { stealth: 2, medicine: 1 }, disciplines: ['Obfuscate'] },
      'Siren': { skills: { persuasion: 2, performance: 1 }, disciplines: ['Presence'] }
    };
    const convictions = [
      'Never kill innocents', 'Protect the weak', 'Uphold loyalty', 'Seek redemption', 'Power justifies all'
    ];
    const tokens = ['vampire1.png', 'vampire2.png', 'vampire3.png']; // Имена файлов токенов

    const firstNames = ['Alex', 'Morgan', 'Elena', 'Victor', 'Isabelle', 'Damien', 'Sophia', 'Nikolai'];
    const lastNames = ['Drake', 'Voss', 'Reyes', 'Blackwood', 'Sinclair', 'Moreau', 'Hale', 'Kovacs'];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomName = `${randomFirstName} ${randomLastName}`;

    const randomClan = clans[Math.floor(Math.random() * clans.length)];
    const randomPredator = Object.keys(predatorTypes)[Math.floor(Math.random() * Object.keys(predatorTypes).length)];
    const randomToken = `modules/vtm-random-enemy/tokens/${tokens[Math.floor(Math.random() * tokens.length)]}`;
    
    const randomDisciplines = [predatorTypes[randomPredator].disciplines[0]];
    while (randomDisciplines.length < 3) {
      const discipline = disciplinesList[Math.floor(Math.random() * disciplinesList.length)];
      if (!randomDisciplines.includes(discipline)) randomDisciplines.push(discipline);
    }

    const difficultyMods = {
      easy: { attrMax: 3, skillMax: 2, disciplineMax: 2, bloodPotency: 1 },
      medium: { attrMax: 4, skillMax: 3, disciplineMax: 3, bloodPotency: 2 },
      hard: { attrMax: 5, skillMax: 4, disciplineMax: 4, bloodPotency: 4 }
    };
    const mod = difficultyMods[this.difficulty];

    const attributes = {
      strength: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      dexterity: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      stamina: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      charisma: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      manipulation: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      composure: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      intelligence: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      wits: { value: Math.floor(Math.random() * mod.attrMax) + 1 },
      resolve: { value: Math.floor(Math.random() * mod.attrMax) + 1 }
    };

    const skills = {
      athletics: { value: Math.floor(Math.random() * mod.skillMax) },
      brawl: { value: Math.floor(Math.random() * mod.skillMax) },
      craft: { value: Math.floor(Math.random() * mod.skillMax) },
      drive: { value: Math.floor(Math.random() * mod.skillMax) },
      firearms: { value: Math.floor(Math.random() * mod.skillMax) },
      larceny: { value: Math.floor(Math.random() * mod.skillMax) },
      melee: { value: Math.floor(Math.random() * mod.skillMax) },
      stealth: { value: Math.floor(Math.random() * mod.skillMax) },
      survival: { value: Math.floor(Math.random() * mod.skillMax) },
      animalken: { value: Math.floor(Math.random() * mod.skillMax) },
      etiquette: { value: Math.floor(Math.random() * mod.skillMax) },
      insight: { value: Math.floor(Math.random() * mod.skillMax) },
      intimidation: { value: Math.floor(Math.random() * mod.skillMax) },
      leadership: { value: Math.floor(Math.random() * mod.skillMax) },
      performance: { value: Math.floor(Math.random() * mod.skillMax) },
      persuasion: { value: Math.floor(Math.random() * mod.skillMax) },
      streetwise: { value: Math.floor(Math.random() * mod.skillMax) },
      subterfuge: { value: Math.floor(Math.random() * mod.skillMax) },
      academics: { value: Math.floor(Math.random() * mod.skillMax) },
      awareness: { value: Math.floor(Math.random() * mod.skillMax) },
      finance: { value: Math.floor(Math.random() * mod.skillMax) },
      investigation: { value: Math.floor(Math.random() * mod.skillMax) },
      medicine: { value: Math.floor(Math.random() * mod.skillMax) },
      occult: { value: Math.floor(Math.random() * mod.skillMax) },
      politics: { value: Math.floor(Math.random() * mod.skillMax) },
      science: { value: Math.floor(Math.random() * mod.skillMax) },
      technology: { value: Math.floor(Math.random() * mod.skillMax) }
    };

    for (const [skill, value] of Object.entries(predatorTypes[randomPredator].skills)) {
      skills[skill].value = Math.min(skills[skill].value + value, 5);
    }

    const humanityBase = 7;
    const humanityMod = predatorTypes[randomPredator].humanity || 0;
    const hunger = Math.floor(Math.random() * 5);
    const healthMax = attributes.stamina.value + 3; // Для отображения в превью
    const willpowerMax = attributes.composure.value + attributes.resolve.value; // Для отображения в превью

    return {
      name: randomName,
      clan: randomClan,
      generation: Math.floor(Math.random() * 6) + 8,
      bloodPotency: Math.min(Math.floor(Math.random() * mod.bloodPotency) + 1, 10),
      hunger: hunger,
      predatorType: randomPredator,
      convictions: convictions[Math.floor(Math.random() * convictions.length)],
      disciplines: randomDisciplines,
      attributes,
      skills,
      humanity: Math.max(0, Math.min(10, humanityBase + humanityMod)),
      healthMax: healthMax, // Только для отображения
      willpowerMax: willpowerMax, // Только для отображения
      token: randomToken,
      difficulty: this.difficulty
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.create-enemy').click(() => {
      this.createEnemy(this.getData());
      this.close();
    });
    html.find('.difficulty-select').change((event) => {
      this.difficulty = event.target.value;
      this.render(true);
    });
  }

  async createEnemy(data) {
    const difficultyMods = {
      easy: { disciplineMax: 2 },
      medium: { disciplineMax: 3 },
      hard: { disciplineMax: 4 }
    };
    const mod = difficultyMods[data.difficulty];

    const actorData = {
      name: data.name,
      type: 'vampire',
      img: data.token,
      system: {
        clan: data.clan,
        generation: data.generation,
        bloodPotency: data.bloodPotency,
        hunger: { value: data.hunger },
        predatorType: data.predatorType,
        convictions: [data.convictions],
        humanity: { value: data.humanity, max: 10 },
        health: { value: data.healthMax, max: data.healthMax },
        willpower: { value: data.willpowerMax, max: data.willpowerMax },
        attributes: data.attributes,
        skills: data.skills,
        disciplines: data.disciplines.reduce((acc, disc) => {
          acc[disc.toLowerCase()] = { value: Math.floor(Math.random() * mod.disciplineMax) + 1 };
          return acc;
        }, {})
      },
      token: {
        img: data.token
      }
    };

    const actor = await Actor.create(actorData);
    ui.notifications.info(game.i18n.format('VTMRE.EnemyCreated', { name: actor.name }));
  }
}