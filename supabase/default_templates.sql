create table if not exists default_templates (
  id uuid primary key default gen_random_uuid(),
  template jsonb not null,
  template_type text not null check (template_type = any (array['sharepic', 'overlay'])),
  enabled boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table default_templates enable row level security;

create policy "anon select" on default_templates
  for select to anon using (true);

insert into default_templates (template, template_type, enabled, sort_order) values
(
  '{"id":"titleOnly","name":"Überschrift (opt. Piktogramm)","version":1,"templateType":"sharepic","canvas":{"width":360,"height":450,"colorSetName":"Apricot","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0.2,"backgroundBrightness":100},"elements":[{"id":"logo-1","type":"logo","x":12,"y":405,"visible":true,"localGroup":"Leipzig"},{"id":"arrow-1","type":"arrow","x":308,"y":398,"visible":true,"size":50},{"id":"heading-1","type":"heading","x":30,"y":235,"visible":true,"content":["*Menschen","retten statt","Abschottung!"],"fontSize":3.75,"width":297},{"id":"pictogram-1","type":"pictogram","x":75,"y":50,"visible":true,"pictogramName":"Banner","size":18}]}',
  'sharepic', true, 0
),
(
  '{"id":"titleAndText","name":"Überschrift & Text","version":1,"templateType":"sharepic","canvas":{"width":360,"height":450,"colorSetName":"Green","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0.2,"backgroundBrightness":100},"elements":[{"id":"arrow-1","type":"arrow","x":308,"y":398,"visible":true,"size":50},{"id":"heading-1","type":"heading","x":29,"y":75,"visible":true,"content":["*Kein Ausbau","fossiler Infrastruktur!"],"fontSize":2.6,"width":297},{"id":"text-1","type":"text","x":29,"y":155,"visible":true,"content":["In den letzten Jahrzehnten ist die Energieversorgung in Deutschland auf Energieimporte aus Russland in Form von Erdgas aufgebaut worden."],"width":297}]}',
  'sharepic', true, 1
),
(
  '{"id":"event","name":"Veranstaltung (opt. Piktogramm)","version":1,"templateType":"sharepic","canvas":{"width":360,"height":450,"colorSetName":"Black","highlightColorName":"Light Green","backgroundImage":"./event_bg.jpg","backgroundPositionValue":"top left","backgroundBlur":0,"backgroundBrightness":100},"elements":[{"id":"logo-1","type":"logo","x":12,"y":405,"visible":true,"localGroup":"Leipzig"},{"id":"heading-1","type":"heading","x":29,"y":75,"visible":true,"content":["*Weihnachts-","feier"],"fontSize":3.75,"width":297},{"id":"text-1","type":"text","x":29,"y":175,"visible":true,"content":["%Mit leckeren Plätzchen, Punsch und Pub-Quiz feiern wir die Weihnachtszeit.%","%🗓️ Dienstag, 12.12.2025 – 18:30 Uhr%","%📍 Grünen Quartier, Heinrichstraße 9, Leipzig%"],"width":297}]}',
  'sharepic', true, 2
),
(
  '{"id":"textOnly","name":"Text (opt. Piktogramm)","version":1,"templateType":"sharepic","canvas":{"width":360,"height":450,"colorSetName":"Lavendel","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0.2,"backgroundBrightness":100},"elements":[{"id":"arrow-1","type":"arrow","x":308,"y":398,"visible":true,"size":50},{"id":"text-1","type":"text","x":29,"y":50,"visible":true,"content":["Ziel waren stets Gay Bars in Greenwich Village..."],"width":297}]}',
  'sharepic', true, 3
),
(
  '{"id":"pictogramOnly","name":"Piktogramm","version":1,"templateType":"sharepic","canvas":{"width":360,"height":450,"colorSetName":"Pink","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0.2,"backgroundBrightness":100},"elements":[{"id":"arrow-1","type":"arrow","x":308,"y":398,"visible":true,"size":50},{"id":"pictogram-1","type":"pictogram","x":95,"y":125,"visible":true,"pictogramName":"Streikfaust","size":18}]}',
  'sharepic', true, 4
),
(
  '{"id":"story-top","name":"Top Text","version":1,"templateType":"overlay","canvas":{"width":360,"height":640,"colorSetName":"White","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0,"backgroundBrightness":100},"elements":[{"id":"logo-1","type":"logo","x":12,"y":595,"visible":true,"localGroup":"Leipzig"},{"id":"heading-top","type":"heading","x":30,"y":50,"visible":true,"content":["*Oben"],"fontSize":2.5,"width":297}]}',
  'overlay', true, 0
),
(
  '{"id":"story-bottom","name":"Bottom Text","version":1,"templateType":"overlay","canvas":{"width":360,"height":640,"colorSetName":"White","highlightColorName":"Light Green","backgroundImage":null,"backgroundPositionValue":"top left","backgroundBlur":0,"backgroundBrightness":100},"elements":[{"id":"logo-1","type":"logo","x":12,"y":595,"visible":true,"localGroup":"Leipzig"},{"id":"heading-bottom","type":"heading","x":30,"y":480,"visible":true,"content":["*Unten"],"fontSize":2.5,"width":297}]}',
  'overlay', true, 1
);
