import { useState } from 'react'
import domtoimage from 'dom-to-image-more';
import './App.css'

type Color = {
  name: string;
  value: string;
  logoColor: string;
};

type Pictogram = {
  name: string;
  path: string;
};

function App() {

	const pictograms: Pictogram[] = [
		{ name: "Ackerpflanze", path: "./pictograms/Ackerpflanze.svg" },
		{ name: "Apfel", path: "./pictograms/Apfel.svg" },
		{ name: "Appell", path: "./pictograms/Appell.svg" },
		{ name: "Arbeit", path: "./pictograms/Arbeit.svg" },
		{ name: "Atomkraftwerk", path: "./pictograms/Atomkraftwerk.svg" },
		{ name: "Ausrufezeichen", path: "./pictograms/Ausrufezeichen.svg" },
		{ name: "Bahn", path: "./pictograms/Bahn.svg" },
		{ name: "Banner", path: "./pictograms/Banner.svg" },
		{ name: "Basketball", path: "./pictograms/Basketball.svg" },
		{ name: "BrennendeErde", path: "./pictograms/BrennendeErde.svg" },
		{ name: "Bus", path: "./pictograms/Bus.svg" },
		{ name: "Cannabis", path: "./pictograms/Cannabis.svg" },
		{ name: "Chips", path: "./pictograms/Chips.svg" },
		{ name: "Computer", path: "./pictograms/Computer.svg" },
		{ name: "CoronaMaske", path: "./pictograms/CoronaMaske.svg" },
		{ name: "Doener", path: "./pictograms/Doener.svg" },
		{ name: "Durstloescher", path: "./pictograms/Durstloescher.svg" },
		{ name: "Erde", path: "./pictograms/Erde.svg" },
		{ name: "Fabrik", path: "./pictograms/Fabrik.svg" },
		{ name: "Federball", path: "./pictograms/Federball.svg" },
		{ name: "Feuer", path: "./pictograms/Feuer.svg" },
		{ name: "Flasche", path: "./pictograms/Flasche.svg" },
		{ name: "Fragezeichen", path: "./pictograms/Fragezeichen.svg" },
		{ name: "Fussball", path: "./pictograms/Fussball.svg" },
		{ name: "Geld", path: "./pictograms/Geld.svg" },
		{ name: "Gluehbirne", path: "./pictograms/Gluehbirne.svg" },
		{ name: "Haengepflanze", path: "./pictograms/Haengepflanze.svg" },
		{ name: "Handschlag", path: "./pictograms/Handschlag.svg" },
		{ name: "Handy", path: "./pictograms/Handy.svg" },
		{ name: "Koffer", path: "./pictograms/Koffer.svg" },
		{ name: "Kohlebagger", path: "./pictograms/Kohlebagger.svg" },
		{ name: "Laptop", path: "./pictograms/Laptop.svg" },
		{ name: "Liegestuhl", path: "./pictograms/Liegestuhl.svg" },
		{ name: "Muelleimer", path: "./pictograms/Muelleimer.svg" },
		{ name: "Musikbox", path: "./pictograms/Musikbox.svg" },
		{ name: "Note", path: "./pictograms/Note.svg" },
		{ name: "Ort", path: "./pictograms/Ort.svg" },
		{ name: "Rollstuhl", path: "./pictograms/Rollstuhl.svg" },
		{ name: "Schwimmen", path: "./pictograms/Schwimmen.svg" },
		{ name: "Sonne", path: "./pictograms/Sonne.svg" },
		{ name: "Sonnenbrille", path: "./pictograms/Sonnenbrille.svg" },
		{ name: "Sprechblase", path: "./pictograms/Sprechblase.svg" },
		{ name: "Steikweste", path: "./pictograms/Steikweste.svg" },
		{ name: "Streikfaust", path: "./pictograms/Streikfaust.svg" },
		{ name: "Tasse", path: "./pictograms/Tasse.svg" },
		{ name: "Topfpflanze", path: "./pictograms/Topfpflanze.svg" },
		{ name: "Trillerpfeife", path: "./pictograms/Trillerpfeife.svg" },
		{ name: "Wasserstation", path: "./pictograms/Wasserstation.svg" },
		{ name: "Windrad", path: "./pictograms/Windrad.svg" },
		{ name: "Zeit", path: "./pictograms/Zeit.svg" }
		];

	const colors: Color[] = [
		{ name: "Light Green", value: "#c7ff7a", logoColor: "#000000" },
		{ name: "Green", value: "#33c270", logoColor: "#c7ff7a" },
		{ name: "Lavendel", value: "#9f88ff", logoColor: "#c7ff7a" },
		{ name: "Pink", value: "#f28ade", logoColor: "#c7ff7a" },
		{ name: "Apricot", value: "#ff8568", logoColor: "#c7ff7a" },
		{ name: "Black", value: "#000000", logoColor: "#ffffff" },
		{ name: "White", value: "#ffffff", logoColor: "#000000" },
	];

	const [ortsgruppe, setOrtsgruppe] = useState("Dresden");
	const [logoVisible, setLogoVisible] = useState(true);
	const [arrowVisible, setArrowVisible] = useState(false);
	const [headingTop, setHeadingTop] = useState(true);
	const [heading, setHeading] = useState(["Corporate", "Design", "Generator", "*Test", "*123"]);
	const [highlightColor, setHighlightColor] = useState<Color>(colors[0]);
	const [selectedColor, setSelectedColor] = useState<Color>(colors[0]);
	const [selectedPictogram, setSelectedPictogram] = useState<Pictogram | null>(null);
	const [pictogramPosition, setPictogramPosition] = useState({ x: 175, y: 225 });

	const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedName = event.target.value;
		const selected = pictograms.find(pictogram => pictogram.name === selectedName);
		setSelectedPictogram(selected || null);
	};

	const handleColorChange = (color: Color) => setSelectedColor(color);

	const handleHighlightColorChange = (color: Color) => setHighlightColor(color);

	const handleDownload = () => {
		const node = document.getElementById('sharepic-download');
		if (node) {
			domtoimage.toPng(node, {
				height: 1350,
				width: 1080,
				style: { transform: 'scale(3, 3)', 'transform-origin': 'top left' },
			}).then((dataUrl: string) => {
				const link = document.createElement('a');
				link.download = 'gj-sharepic.png';
				link.href = dataUrl;
				link.click();
			});
		}
	};

	const renderHeading = () => {
		return heading.map((head) => (
			head !== "" ? (
				<h1
					key={head}
					className={
						headingTop
							? 'wix-madefor-display-800'
							: 'heading-top-reset wix-madefor-display-800'
						}
					style={
						head.startsWith('*')
							? {
								backgroundColor: highlightColor.value,
								color: highlightColor.name === "Black"
									? '#ffffff'
									: '#000000'
							}
							: {
								backgroundColor: selectedColor.name === "White"
									? '#000000'
									: '#ffffff',
								color: selectedColor.name === "White"
									? '#ffffff'
									: '#000000',
					}}
				>
					{head.replace('*', '')}
				</h1>
			) : null
		));
	};

	const renderPictogram = () => {
		if (selectedPictogram) {
		return (
			<div
				style={{
					filter: selectedColor.name === "Black" ? 'invert()' : '',
					maxWidth: 'max-content',
					position: 'relative',
					top: `${pictogramPosition.y}px`,
					left: `${pictogramPosition.x}px`,
				}}
			>
				<img
					src={selectedPictogram.path}
					alt={selectedPictogram.name}
					style={{ width: '18rem', height: '18rem' }}
				/>
			</div>
		);
		}
		return null;
	};

	return (
    <div className="inner">
      <div className='container'>
        <div id='my-node' className='sharepic-container'>
          <div className='sharepic-canvas' style={{ backgroundColor: selectedColor.value }}>
            {logoVisible && (
              <>
                <p style={{ color: selectedColor.logoColor }} className='gj-logo'>
                  Grüne<br /><span>Jugend</span>
                </p>
                <p style={{ color: selectedColor.logoColor }} className='ortsgruppe'>
                  {ortsgruppe || " "}
                </p>
              </>
            )}
            {arrowVisible && (
              <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
                <polygon
                  points="91.901 49.6605 87.777 54.3235 112.216 75.9385 35.955 75.9385 35.955 82.1635 112.335 82.1635 91.063 106.2145 95.727 110.3395 120.646 82.1635 120.976 82.1635 120.976 81.7925 124.045 78.3215 123.804 78.1085 123.919 77.9785 91.901 49.6605"
                  style={{ fill: selectedColor.logoColor }}
                />
              </svg>
            )}
            <div className={headingTop ? 'heading-top' : 'heading-bottom'}>
              {renderHeading()}
            </div>
            {renderPictogram()}
          </div>
        </div>
        <button onClick={handleDownload}>Download</button>
      </div>

      <div className='container'>
        <h2>Hintergrund</h2>
        {colors.map((color) => (
		<div
			style={{
				display: 'inline-block',
				width: 25,
				height: 25,
				borderRadius: 25,
				border: '1px solid black',
				backgroundColor: color.value
			}}>
			<label key={color.value}>
				<input
					type="radio"
					name="color"
					value={color.value}
					checked={selectedColor.value === color.value}
					onChange={() => handleColorChange(color)}
					className="hidden"
				/>
			</label>
		  </div>
        ))}
		<h2>Highlight Farbe</h2>
        {colors.map((color) => (
		<div
			style={{
				display: 'inline-block',
				width: 25,
				height: 25,
				borderRadius: 25,
				border: '1px solid black',
				backgroundColor: color.value
			}}>
			<label key={color.value}>
				<input
					type="radio"
					name="highlightcolor"
					value={color.value}
					checked={highlightColor.value === color.value}
					onChange={() => handleHighlightColorChange(color)}
					className="hidden"
				/>
			</label>
		  </div>
        ))}
        <h2>Logo sichtbar?</h2>
        <input type="checkbox" checked={logoVisible} onChange={() => setLogoVisible(!logoVisible)} />
        <h2>Pfeil sichtbar?</h2>
        <input type="checkbox" checked={arrowVisible} onChange={() => setArrowVisible(!arrowVisible)} />
        <h2>Ortsgruppe</h2>
        <input type="text" value={ortsgruppe} onChange={(e) => setOrtsgruppe(e.target.value)} />
        <h2>Überschrift oben/unten?</h2>
        <input type="checkbox" checked={headingTop} onChange={() => setHeadingTop(!headingTop)} />
        <h2>Überschrift</h2>
        <textarea
          cols={20}
          rows={5}
          wrap="hard"
          maxLength={100}
          value={heading.join("\n")}
          onChange={(e) => setHeading(e.target.value.split(/\r?\n/).slice(0, 5))}
        />
        <h2>Piktogramm</h2>
        <select onChange={handleSelectionChange} defaultValue="">
          <option value="" disabled>Wählen Sie ein Piktogramm</option>
          {pictograms.map(pictogram => (
            <option key={pictogram.name} value={pictogram.name}>
              {pictogram.name}
            </option>
          ))}
        </select>
        <div>
          <input type='number' value={pictogramPosition.x} onChange={(e) => setPictogramPosition({ ...pictogramPosition, x: parseInt(e.target.value) })} />
          <input type='number' value={pictogramPosition.y} onChange={(e) => setPictogramPosition({ ...pictogramPosition, y: parseInt(e.target.value) })} />
        </div>
      </div>
    </div>
  );
}

export default App;
