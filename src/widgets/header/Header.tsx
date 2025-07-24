'use client';

import { IconChevronDown } from '@tabler/icons-react';
import {
	Box,
	Burger,
	Button,
	Center,
	Collapse,
	Divider,
	Drawer,
	Group,
	HoverCard,
	ScrollArea,
	SimpleGrid,
	Text,
	ThemeIcon,
	UnstyledButton,
	useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './header.module.css';
import ThemeToggleButton from '../themeToggleButton/ThemeToggleButton';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NAV_BUTTONS } from '@/shared/constants/headerBtns.constants';
import { NAV_LINKS } from '@/shared/constants/navLinks.constant';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';

const Header = React.memo(() => {
	const { data: session, status } = useSession();

	const currentUser = useStore(state => state.currentUser);

	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
	const theme = useMantineTheme();
	const router = useRouter();
	const pathname = usePathname();

	const renderAuthButtons = () => {
		if (status === 'loading')
			return (
				<Button loading variant='default'>
					Loading...
				</Button>
			);

		if (session) {
			return (
				<UnstyledButton
					onClick={() => {
						router.push('/profile');
						closeDrawer();
					}}
					className={getActiveLink('/profile')}
					p={0}
				>
					<Text fw={500} size='sm'>
						{currentUser?.name}
					</Text>
				</UnstyledButton>
			);
		}
	};

	const getActiveLink = (href: string) => {
		return pathname === href
			? `${classes.link} ${classes.active_link}`
			: classes.link;
	};

	const renderNavLinks = NAV_LINKS.map(item => {
		if (item.type === 'dropdown') {
			return (
				<HoverCard
					key={item.key}
					width={600}
					position='bottom'
					radius='md'
					shadow='md'
					withinPortal
				>
					<HoverCard.Target>
						<UnstyledButton className={classes.link}>
							<Center inline>
								<Box component='span' mr={5}>
									{item.label}
								</Box>
								<IconChevronDown
									size={16}
									color={theme.colors.blue[6]}
								/>
							</Center>
						</UnstyledButton>
					</HoverCard.Target>
					<HoverCard.Dropdown style={{ overflow: 'hidden' }}>
						<Group justify='space-between' px='md'>
							<Text fw={500}>{item.label}</Text>
							{item.dropdownItems && (
								<Text fz='xs'>
									{item.dropdownItems.length} options
								</Text>
							)}
						</Group>
						<Divider my='sm' />
						<SimpleGrid cols={2} spacing={0}>
							{item.dropdownItems?.map(dropdownItem => (
								<Link
									href={`/post-create?topic=${dropdownItem.topic}`}
									className={classes.subLink}
									key={dropdownItem.title}
								>
									<Group wrap='nowrap' align='flex-start'>
										<ThemeIcon
											size={34}
											variant='default'
											radius='md'
										>
											<dropdownItem.icon
												size={22}
												color={theme.colors.blue[6]}
											/>
										</ThemeIcon>
										<div>
											<Text size='sm' fw={500}>
												{dropdownItem.title}
											</Text>
											<Text size='xs' c='dimmed'>
												{dropdownItem.description}
											</Text>
										</div>
									</Group>
								</Link>
							))}
						</SimpleGrid>
					</HoverCard.Dropdown>
				</HoverCard>
			);
		}

		return (
			<Link
				key={item.key}
				href={item.href}
				className={getActiveLink(item.href)}
				onClick={() => closeDrawer()}
			>
				{item.label}
			</Link>
		);
	});

	const renderNavButtons = NAV_BUTTONS.map(button => (
		<Button
			key={button.key}
			variant={
				pathname === button.href
					? 'light'
					: button.key === 'register'
					? 'default'
					: ''
			}
			onClick={() => {
				router.push(button.href);
				getActiveLink(button.href);
				closeDrawer();
			}}
		>
			{button.label}
		</Button>
	));

	return (
		<header className={classes.header}>
			<Group justify='space-between' h='100%'>
				<ThemeToggleButton />
				<Group
					h='100%'
					gap={0}
					visibleFrom='sm'
					className={classes.nav_links}
				>
					{renderNavLinks}
				</Group>

				<Group visibleFrom='sm'>
					{status === 'unauthenticated'
						? renderNavButtons
						: renderAuthButtons()}
				</Group>

				<Burger
					opened={drawerOpened}
					onClick={toggleDrawer}
					hiddenFrom='sm'
				/>
			</Group>

			<Drawer
				opened={drawerOpened}
				className={classes.header_hidden}
				onClose={closeDrawer}
				size='100%'
				padding='md'
				title='Navigation'
				hiddenFrom='sm'
				zIndex={1000000}
			>
				<ScrollArea h='calc(100vh - 80px' mx='-md'>
					<Divider my='sm' />

					{NAV_LINKS.map(item =>
						item.type === 'dropdown' ? (
							<div key={item.key}>
								<UnstyledButton
									className={classes.link}
									onClick={toggleLinks}
									key={item.key}
								>
									<Center inline>
										<Box component='span' mr={5}>
											{item.label}
										</Box>
										<IconChevronDown
											size={16}
											color={theme.colors.blue[6]}
										/>
									</Center>
								</UnstyledButton>
								<Collapse in={linksOpened}>
									{item.dropdownItems?.map(dropdownItem => (
										<Link
											href={`/post-create?topic=${dropdownItem.topic}`}
											onClick={() => closeDrawer()}
											className={classes.subLink}
											key={dropdownItem.title}
										>
											<Group
												wrap='nowrap'
												align='flex-start'
											>
												<ThemeIcon
													size={34}
													variant='default'
													radius='md'
												>
													<dropdownItem.icon
														size={22}
														color={
															theme.colors.blue[6]
														}
													/>
												</ThemeIcon>
												<div>
													<Text size='sm' fw={500}>
														{dropdownItem.title}
													</Text>
													<Text size='xs' c='dimmed'>
														{
															dropdownItem.description
														}
													</Text>
												</div>
											</Group>
										</Link>
									))}
								</Collapse>
							</div>
						) : (
							<Link
								key={item.key}
								href={item.href}
								className={getActiveLink(item.href)}
								onClick={closeDrawer}
							>
								{item.label}
							</Link>
						)
					)}

					<Divider my='sm' />

					<Group justify='center' grow pb='xl' px='md'>
						{status === 'unauthenticated' ? (
							renderNavButtons
						) : (
							<>{renderAuthButtons()}</>
						)}
					</Group>
				</ScrollArea>
			</Drawer>
		</header>
	);
});

export default Header;
