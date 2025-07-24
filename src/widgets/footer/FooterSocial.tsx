import {
	IconBrandGithub,
	IconBrandInstagram,
	IconBrandTiktok
} from '@tabler/icons-react';
import { ActionIcon, Container, Group } from '@mantine/core';
import classes from './footerSocial.module.css';
import Link from 'next/link';
import React from 'react';

const FooterSocial = React.memo(() => {
	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Group
					className={classes.links}
					justify='flex-end'
					wrap='nowrap'
				>
					<Link href='https://www.tiktok.com/@xaityh'>
						<ActionIcon size='lg' color='gray' variant='subtle'>
							<IconBrandTiktok size={18} stroke={1.5} />
						</ActionIcon>
					</Link>

					<Link href='https://github.com/XAITYH'>
						<ActionIcon size='lg' color='gray' variant='subtle'>
							<IconBrandGithub size={18} stroke={1.5} />
						</ActionIcon>
					</Link>

					<Link href='https://www.instagram.com/xaityh2.0'>
						<ActionIcon size='lg' color='gray' variant='subtle'>
							<IconBrandInstagram size={18} stroke={1.5} />
						</ActionIcon>
					</Link>
				</Group>
			</Container>
		</div>
	);
});

export default FooterSocial;
