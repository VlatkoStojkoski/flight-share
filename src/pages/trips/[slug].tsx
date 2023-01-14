import { useEffect, useState } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { api } from 'utils/api';
import logo from 'assets/img/logo.png';
import ClockIcon from 'components/icons/clock';
import PlaneIcon from 'components/icons/plane';

const mapTimesToPixels = (times: number[], pixelsPerMinute = 1, min = -1): [number, number][] => {
	min = min === -1 ? Math.min(...times.flat()) : min;
	const pixelsPerMillisecond = pixelsPerMinute / 60000;

	const mappedTimes = times.map((time) =>
		[(time - min) * pixelsPerMillisecond, time] as [number, number]
	);

	return mappedTimes;
};

const mapSegmentTimesToPixels = (segmentTimes: [number, number][], pixelsPerMinute = 1): [[number, number],[number, number]][] => {
	const min = Math.min(...segmentTimes.flat());
	
	const mappedSegmentTimes = segmentTimes.map(([startTime, endTime]) =>
		mapTimesToPixels([startTime, endTime], pixelsPerMinute, min) as [[number, number],[number, number]]
	);

	return mappedSegmentTimes;
};

const to2DigitTime = (hours: number, minutes: number) => {
	const h = hours < 10 ? `0${hours}` : hours;
	const m = minutes < 10 ? `0${minutes}` : minutes;
	return `${h}:${m}`;
};

const Trip: NextPage = () => {
	const { query } = useRouter();
	const { data: tripData, mutate: getTripData } = api.trips.getTrip.useMutation();
	const [ mappedTimes, setMappedTimes ] = useState<[[number, number], [number, number]][]>([]);
	const [ times, setTimes ] = useState<number[]>([]);
	const [ PPM, setPPM ] = useState(2);

	useEffect(() => {
		if(query.slug) {
			getTripData({
				slug: query.slug.toString(),
				includeSegments: true
			});
		}
	}, [query]);

	useEffect(() => {
		console.log(tripData);

		if(tripData) {
			const _times = tripData.segments.map((segment) => {
				const {startDate, endDate} = segment;
				const start = new Date(startDate).getTime();
				const end = new Date(endDate).getTime();
				console.log(start, end);
				return [start, end] as [number, number];
			});

			setTimes(_times.flat());

			setMappedTimes(mapSegmentTimesToPixels(_times, PPM));
		}

		
	}, [tripData, PPM]);

  return tripData ? (
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
				<div className="w-full max-w-[35rem] mx-auto min-h-screen">
					<h2 className='text-4xl font-bold font-heading text-primary-800'>{tripData.name}</h2>
					<p className='text-lg text-neutral-700 mb-4'>{query.slug}</p>

					<h3 className='text-2xl font-semibold text-center text-primary-500 mb-2'>Timeline</h3>

					<div
						className="relative flex flex-col gap-2 min-w-[220px] w-1/2 mx-auto mb-3"
						style={{
							height: `calc(${(new Date(Math.max(...times)).getHours() - new Date(Math.min(...times)).getHours()) * 60 * PPM}px + 1rem)`
						}}>
						<div className="absolute left-0 top-0 -translate-x-[calc(100%+0.75rem)] h-full w-[2px] bg-neutral-400">
							{
								(() => {
									const min = new Date(Math.min(...times)).getHours();
									const max = new Date(Math.max(...times)).getHours() + 1;

									return Array.from({length: max-min}, (_, hIdx) => {
										const currH = min+hIdx;

										return (
											<div
												key={hIdx}
												className="absolute left-0 -translate-x-full h-[2px] w-[10px] bg-neutral-400"
												style={{
													top: `${hIdx*PPM*60}px`,
												}}>
												<p className='absolute transition-all rotate-90 -translate-x-[1.35rem] top-[15px] sm:rotate-0 sm:left-[5px] sm:top-0 sm:-translate-x-full text-neutral-500'>
													{to2DigitTime(currH, 0)}
												</p>
											</div>
										);
									});

								})()
							}
						</div>

						<div className="relative flex flex-col">
							{
								mappedTimes.length > 0 &&
								tripData.segments.map((segment, sIdx) => {
									const mappedSegment = mappedTimes[sIdx];

									if(!mappedSegment) return null;

									console.log(sIdx, mappedSegment);

									const height = mappedSegment[1][0] - mappedSegment[0][0];
									
									return (
										<div key={sIdx} className="absolute w-full bg-amber-900	text-white rounded-lg p-3" style={{
												height: `${height}px`,
												top: `${mappedSegment[0][0]}px`,
											}}>
											<p className='font-semibold'>{segment.name}</p>
											<div className='flex items-center'>
												<div className="inline-flex w-6 h-6 items-center justify-center">
													<ClockIcon className='h-4 w-auto' />
												</div>
												{to2DigitTime(segment.startDate.getHours(), segment.startDate.getMinutes())} -&gt;
												{to2DigitTime(segment.endDate.getHours(), segment.endDate.getMinutes())}
											</div>
											<div className='flex items-center'>
												<div className="inline-flex w-6 h-6 items-center justify-center">
													<PlaneIcon className='h-6 w-auto' />
												</div>
												SKP -&gt; JFK
											</div>
										</div>
									);
								})
							}
						</div>
					</div>

					<button
						className={`block w-1/2 min-w-[180px] mx-auto bg-gradient-to-br from-secondary-400
												to-secondary-500 hover:from-secondary-500 hover:to-secondary-400 rounded-lg py-3 px-5
												active:brightness-90`}>
						+ Add trip segment
					</button>
				</div>
			</main>
		</>
	) : (
		<></>
	);
};

export default Trip;