import Input from "../atoms/Input";

type EditorBackgroundImageProps = {
	handleBackgroundImage: (base64File: string) => void;
	handleFileDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function EditorBackgroundImage({ handleBackgroundImage, handleFileDelete }: EditorBackgroundImageProps) {

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === "string") {
				handleBackgroundImage(reader.result);
			}
		};
		reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<h2>Hintergrundbild</h2>
			<Input
				type="file"
				accept="image/*"
				onChange={handleImageUpload}
				onFileDelete={handleFileDelete}
			/>
		</>
	);
}
