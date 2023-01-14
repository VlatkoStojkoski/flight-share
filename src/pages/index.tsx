import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

import logo from 'assets/img/logo.png';
import shareIcon from 'assets/img/share.svg';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const {data, status} = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard')
				.catch((error) => {
					console.error('Redirect failed', error);
				});
		}
	}, [status]);
	

  return (
    <>
      <Head>
        <title>FlightShare</title>
        <meta name="description" content="A creative way to share realtime information about your plane trips with those who care." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
			
			<nav className='fixed top-0 w-full z-40 backdrop-blur-[2px] px-8 py-4'>
				<Link href='/' className='block w-fit mx-auto'>
					<Image src={logo} alt='Logo' className='h-12 w-auto' />
				</Link>
			</nav>

			<main className='pt-24 sm:pt-8 pb-8 px-5'>
				<div className="container mx-auto min-h-screen flex gap-6 flex-col sm:flex-row items-center justify-center">
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
					<Image src={shareIcon} alt='Hero illustration' className='w-[90%] sm:h-[90vh] sm:max-w-[min(50%,450px)]' />
					<div className="w-full max-w-[27.5rem]">
						<h1 className='text-5xl text-primary-800 mb-2 font-heading font-bold'>
							FlightShare
						</h1>
						<p className='text-2xl text-secondary-500'>
							A creative way to share realtime information about your plane trips with those who care.
						</p>

						<button
							className='bg-primary-900 hover:bg-primary-800 text-white px-6 py-3 text-2xl mt-5'
							onClick={() => {
								signIn()
									.catch((error) => {
										console.error('Sign in failed', error);
									});
							}}>
							Sign Up
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;