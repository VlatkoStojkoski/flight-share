import { useEffect, useState } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import logo from 'assets/img/logo.png';
import NewTripPopup from 'components/NewTripPopup';
import { api } from 'utils/api';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const [newTripPopup, setNewTripPopup] = useState(false);
	const {data: tripsData, refetch: refetchTrips} = api.trips.getTrips.useQuery();
	const {data: newTripData, mutate: newTrip, error: newTripError, isLoading: isNewTripDataLoading} = api.trips.newTrip.useMutation();
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		console.log('error', newTripError);
		if (newTripError?.message) {
			console.log('newTripError.message', newTripError.message);

			const codeMatch = newTripError.message.match(/(?<=\().+(?=\))/);

			if(!codeMatch) {
				alert('Something went wrong');
				return;
			}

			console.log('codeMatch[0]',codeMatch[0]);

			switch(codeMatch[0]) {
				case 'TRIPS/SLUG-IN-USE':
					alert('Slug already in use');
					break;
				default:
					alert('Something went wrong');
			}
		}
	}, [newTripError]);

	useEffect(() => {
		if(newTripData) {
			refetchTrips().catch(console.error);
			setNewTripPopup(false);
		}
	}, [newTripData]);
	
	useEffect(() => {
		if (session.status === 'unauthenticated') {
			router.push('/').catch(console.error);
		}
	}, [session]);

  return (
    <>
      <Head>
        <title>Dashboard | FlightShare</title>
        <meta name="description" content="A creative way to share realtime information about your plane trips with those who care." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
			
			<nav className='fixed top-0 w-full z-40 backdrop-blur-[2px] px-8 py-4'>
				<Link href='/' className='block w-fit mx-auto'>
					<Image src={logo} alt='Logo' className='h-12 w-auto' />
				</Link>
			</nav>

			<main className='pt-24 pb-8 px-5'>
				<div className="container mx-auto min-h-screen">
					<h1 className='text-5xl text-primary-800 font-heading font-bold mb-4'>Trips:</h1>

					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 300px))',
						gap: '1rem'
					}}>
						{tripsData &&
							tripsData.map((trip, tripIdx) => {
								return (
									<Link
										key={tripIdx}
										href={`/trips/${trip.slug}`}
										className='p-3 bg-secondary-100 hover:bg-secondary-200 transition-all'>
										<h3 className='text-2xl font-semibold font-heading'>{trip.name}</h3>
										<p className='text-lg text-neutral-800'>{trip.description}</p>
									</Link>
								);
							})}
					</div>

					<NewTripPopup
						className={newTripPopup ? '' : 'hidden'} 
						createTrip={(inputsTripData) => {
							console.log('data', inputsTripData);
							newTrip(inputsTripData);
						}}
						onClose={() => setNewTripPopup(false)} 
						isLoading={isNewTripDataLoading} />

					<button
							className='bg-primary-900 hover:bg-primary-800 transition-all text-white px-6 py-3 text-2xl mt-5'
							onClick={() => {
								setNewTripPopup(true);
							}}>
							New Trip
						</button>
				</div>
			</main>
		</>
	);
};

export default Home;