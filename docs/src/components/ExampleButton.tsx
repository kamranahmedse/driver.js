type ExampleButtonProps = {
  id: string;
  onClick: () => void;
  text: string;
};

export function ExampleButton(props: ExampleButtonProps) {
  const { id, onClick, text } = props;

  return (
    <button
      id={id}
      onClick={onClick}
      className="bg-transparent rounded-lg lg:rounded-xl py-2 px-4 font-medium text-black border-2 border-black md:text-base lg:text-lg hover:bg-yellow-300 hover:text-black transition-colors duration-100">
      { text }
    </button>
  );
}