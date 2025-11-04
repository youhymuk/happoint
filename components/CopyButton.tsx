'use client';

import { useState } from 'react';

import CheckIcon from './icons/CheckIcon';
import CopyIcon from './icons/CopyIcon';
import ErrorIcon from './icons/ErrorIcon';

type CopyStatus = 'idle' | 'copied' | 'error';

type CopyButtonProps = {
	value: string;
	name?: string;
	className?: string;
};

const COPY_STATUS_CHANGE_DURATION = 2500;

export default function CopyButton({
	value,
	name = 'link',
	className,
}: CopyButtonProps) {
	const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

	const shouldShowCopyStatus = copyStatus !== 'idle';
	const isError = copyStatus === 'error';

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(value);

			setCopyStatus('copied');
			setTimeout(() => setCopyStatus('idle'), COPY_STATUS_CHANGE_DURATION);
		} catch (error) {
			console.error(`Failed to copy ${name}:`, error);

			setCopyStatus('error');
			setTimeout(() => setCopyStatus('idle'), COPY_STATUS_CHANGE_DURATION);
		}
	}

	return (
		<div className='flex flex-col relative'>
			<button
				type='button'
				onClick={handleCopy}
				className={className}
				title={`Copy ${name}`}
			>
				<CopyIcon />
				<span>Copy {name}</span>
			</button>
			{shouldShowCopyStatus && (
				<div
					className='
						mt-1 flex items-center gap-1 text-xs absolute bottom-[-1rem] left-0'
				>
					{isError ? (
						<>
							<ErrorIcon className='h-3 w-3' />
							<span className='text-[var(--error)]'>Failed to copy {name}</span>
						</>
					) : (
						<>
							<CheckIcon className='h-3 w-3' />
							<span className='text-[var(--success)]'>Copied!</span>
						</>
					)}
				</div>
			)}
		</div>
	);
}
