(() => {
  const DATA = window.ARCHAEOLOGY_DATA;
  const LEVELS = window.ARCHAEOLOGY_LEVELS;
  const source = 'https://runescape.wiki/w/Collections';
  const artefacts = {
    'Lunar calendar': { chronotes: 468, xp: 1773.3, materials: { 'Banded limestone': 28, Triskelion: 24 } },
    'Wolf statuette': { chronotes: 468, xp: 1773.3, materials: { 'Banded limestone': 26, Ivory: 26 } },
    'Ivory sickle': { chronotes: 468, xp: 1773.3, materials: { Ivory: 28, Triskelion: 24 } },
    'Nakkirian seal': { chronotes: 552, xp: 2263.3, materials: { Ivory: 34, 'White oak': 28, 'Soft clay': 1 } },
    'Royal Game of Ba': { chronotes: 552, xp: 2263.3, materials: { 'White oak': 32, Triskelion: 30 } },
    'Backstrap loom': { chronotes: 580, xp: 3733.3, materials: { 'White oak': 30, 'Burnt umber': 18, Cashmere: 16 } },
    'Animal doll': { chronotes: 580, xp: 3733.3, materials: { Cashmere: 24, 'White oak': 24, Ivory: 16 } },
    "Initiate's kaunake": { chronotes: 580, xp: 3733.3, materials: { Cashmere: 30, 'Burnt umber': 20, 'Leather scraps': 14 } },
    'Incense burner': { chronotes: 584, xp: 5830, materials: { 'Banded limestone': 24, 'White oak': 18, Cashmere: 20 } },
    'Offering bowl': { chronotes: 584, xp: 5830, materials: { 'Banded limestone': 22, Triskelion: 20, 'Burnt umber': 20 } },
    Bloodwine: { chronotes: 668, xp: 7777.8, materials: { 'Leather scraps': 32, Triskelion: 20, Cashmere: 20, Grapes: 1 } },
    'Reagent jar': { chronotes: 668, xp: 7777.8, materials: { 'Leather scraps': 20, 'Banded limestone': 22, 'Burnt umber': 30 } },
    'Ninbaradari mural': { chronotes: 680, xp: 7777.8, materials: { 'Burnt umber': 30, 'Banded limestone': 22, Triskelion: 20 } },
    'Bloodletting dagger': { chronotes: 722, xp: 10111.1, materials: { Ivory: 28, Cashmere: 24, Soapstone: 26 } },
    'Fang of Kayazu': { chronotes: 722, xp: 10111.1, materials: { Ivory: 38, 'Burnt umber': 20, Soapstone: 20 } },
    "Centurion's dress sword": { chronotes: 0, xp: 250, materials: { 'Imperial iron': 5, 'Purpleheart wood': 5 } }
  };
  const guthixianOne = ['Lunar calendar', 'Wolf statuette', 'Ivory sickle', 'Nakkirian seal', 'Royal Game of Ba', 'Backstrap loom', 'Animal doll', "Initiate's kaunake"];
  const guthixianTwo = ['Incense burner', 'Offering bowl', 'Bloodwine', 'Reagent jar', 'Ninbaradari mural', 'Bloodletting dagger', 'Fang of Kayazu'];
  const makeArtefacts = names => names.map(name => ({ name, damaged: 0, restored: 0, ...artefacts[name], materials: { ...artefacts[name].materials } }));
  const makeCollection = (name, group, setBonus, names, extra = {}) => ({ name, group, setBonus, source, ...extra, artifacts: makeArtefacts(names) });
  const dragonkinTwoSource = DATA.collections.find(collection => collection.name === 'Museum - Dragonkin II');
  const collectors = [
    makeCollection('Guthixian I', 'Collectors', 4248, guthixianOne),
    makeCollection('Guthixian II', 'Collectors', 4628, guthixianTwo),
    { name: 'Dragonkin II', group: 'Collectors', setBonus: 3444, source, artifacts: dragonkinTwoSource.artifacts.map(artefact => ({ ...artefact, damaged: 0, restored: 0, materials: { ...artefact.materials } })) }
  ];
  const museum = [
    makeCollection('Museum - Training Weapons', 'Museum', 1000, ["Centurion's dress sword"], { recurring: false }),
    makeCollection('Museum - Guthixian I', 'Museum', 5310, guthixianOne),
    makeCollection('Museum - Guthixian II', 'Museum', 5785, guthixianTwo)
  ];
  const missingCollectors = collectors.filter(collection => !DATA.collections.some(existing => existing.name === collection.name));
  const firstMuseum = DATA.collections.findIndex(collection => collection.group === 'Museum');
  DATA.collections.splice(firstMuseum < 0 ? DATA.collections.length : firstMuseum, 0, ...missingCollectors);
  DATA.collections.push(...museum.filter(collection => !DATA.collections.some(existing => existing.name === collection.name)));
  Object.assign(LEVELS, {
    'Lunar calendar': 52, 'Wolf statuette': 52, 'Ivory sickle': 52, 'Nakkirian seal': 59,
    'Royal Game of Ba': 59, 'Backstrap loom': 66, 'Animal doll': 66, "Initiate's kaunake": 66,
    'Incense burner': 75, 'Offering bowl': 75, Bloodwine: 82, 'Reagent jar': 82,
    'Ninbaradari mural': 82, 'Bloodletting dagger': 88, 'Fang of Kayazu': 88,
    "Centurion's dress sword": 1
  });
})();
