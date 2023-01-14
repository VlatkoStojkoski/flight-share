import React, { useState } from 'react';
import Image from 'next/image';

import closeIcon from 'assets/img/close.svg';

const NewTripPopup: React.FC<{
	createTrip: (options: {
		name: string,
		slug: string,
		description: string,
		destination: string,
	}) => void;
	onClose: () => void;
	isLoading?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
	{ createTrip, onClose, className, isLoading, ...rest }
) => {
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [description, setDescription] = useState('');
	const [destination, setDestination] = useState('');

	return (
		<div 
			className={`fixed top-0 left-0 z-40 w-full h-screen backdrop-blur-[2px]
									flex items-center justify-center ${className || ''}`}
			{...rest}>
			<div
				className={`relative w-full max-w-[25rem] min-h-[300px] mx-4 bg-white border-[1px]
									border-neutral-300 rounded-md p-3 pb-5 flex flex-col gap-3`}>
				<Image
					src='/assets/img/close.svg'
					className='absolute top-2 right-2 cursor-pointer'
					style={{
						filter: 'invert(31%) sepia(28%) saturate(6707%) hue-rotate(346deg) brightness(87%) contrast(82%)',
					}}
					alt='Close icon'
					height={30}
					width={30}
					onClick={onClose} />
				<h1 className='text-3xl text-center font-heading font-bold'>New trip</h1>
				<div className="">
					<label htmlFor="name">Trip name:</label>
					<br />
					<input
						type="text"
						placeholder='Enter trip name...'
						className='px-2 py-1 border-neutral-600 border-[1px]'
						value={name}
						onChange={e => setName(e.target.value)}
						required />
				</div>
				<div className="">
					<label htmlFor="name">Trip description:</label>
					<br />
					<textarea
						rows={3}
						placeholder='Enter trip description'
						className='px-2 py-1 border-neutral-600 border-[1px]'
						value={description}
						onChange={e => setDescription(e.target.value)}
						required />
				</div>
				<div className="">
					<label htmlFor="name">Slug:</label>
					<br />
					<input
						type="text"
						placeholder="Enter trip slug"
						className='px-2 py-1 border-neutral-600 border-[1px]'
						value={slug}
						onChange={e => setSlug(e.target.value)}
						required />
					<p className='text-sm mt-1 text-zinc-700'>* Your trip&apos;s short URL (only lowercase characters and dashes)</p>
				</div>
				<div className="">
					<label htmlFor="name">Destination:</label>
					<br />
					<input
						type="text"
						placeholder="Enter trip's destination..."
						className='px-2 py-1 border-neutral-600 border-[1px]'
						value={destination}
						onChange={e => setDestination(e.target.value)}
						required />
				</div>

				<button
					className='bg-secondary-600 hover:bg-secondary-500 transition-all text-white mt-2 py-1 text-xl'
					onClick={() => createTrip({
						name,
						slug,
						description,
						destination,
					})}>
					{isLoading ? 'Loading...' : 'Submit'}
				</button>
			</div>
		</div>
	);
};

export default NewTripPopup;