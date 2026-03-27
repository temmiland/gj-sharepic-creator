import './SharePicLogo.scss';

type SharePicLogoProps = {
	localGroup: string;
	visible: boolean;
	color: string;
};

export function SharePicLogo({ localGroup, visible, color }: SharePicLogoProps) {

	return visible && (
		<div className="logo-wrapper">
			<p style={{ color }} className='gj-logo'>
				Grüne<br /><span>Jugend</span>
			</p>
			<p style={{ color }} className='ortsgruppe'>
				{localGroup || " "}
			</p>
		</div>
	);
}
