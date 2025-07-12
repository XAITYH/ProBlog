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
import { mockdata } from '@/constants/header.constants';
import classes from './header.module.css';
import ThemeToggleButton from '../themeToggleButton/ThemeToggleButton';
import { useRouter } from 'next/navigation';

const Header = () => {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
	const theme = useMantineTheme();
	const router = useRouter();

	const links = mockdata.map(item => (
		<UnstyledButton className={classes.subLink} key={item.title}>
			<Group wrap='nowrap' align='flex-start'>
				<ThemeIcon size={34} variant='default' radius='md'>
					<item.icon size={22} color={theme.colors.blue[6]} />
				</ThemeIcon>
				<div>
					<Text size='sm' fw={500}>
						{item.title}
					</Text>
					<Text size='xs' c='dimmed'>
						{item.description}
					</Text>
				</div>
			</Group>
		</UnstyledButton>
	));

	function goToLogin() {
		router.push('/login');
	}

	function goToRegister() {
		router.push('/register');
	}

	return (
		<Box pb={60}>
			<header className={classes.header}>
				<Group justify='space-between' h='100%'>
					<ThemeToggleButton />
					<Group h='100%' gap={0} visibleFrom='sm'>
						<a href='/' className={classes.link}>
							Home
						</a>
						<HoverCard
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
											Create a post{' '}
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
									<Text fw={500}>Create a post</Text>
									<Text fz='xs'>4 different types</Text>
								</Group>

								<Divider my='sm' />

								<SimpleGrid cols={2} spacing={0}>
									{links}
								</SimpleGrid>
							</HoverCard.Dropdown>
						</HoverCard>
						<a href='/help' className={classes.link}>
							Get Help
						</a>
						<a href='/news' className={classes.link}>
							News
						</a>
					</Group>

					<Group visibleFrom='sm'>
						<Button onClick={goToLogin}>Log in</Button>
						<Button variant='default' onClick={goToRegister}>
							Sign up
						</Button>
					</Group>

					<Burger
						opened={drawerOpened}
						onClick={toggleDrawer}
						hiddenFrom='sm'
					/>
				</Group>
			</header>

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size='100%'
				padding='md'
				title='Navigation'
				hiddenFrom='sm'
				zIndex={1000000}
			>
				<ScrollArea h='calc(100vh - 80px' mx='-md'>
					<Divider my='sm' />

					<a href='/' className={classes.link}>
						Home
					</a>
					<UnstyledButton
						className={classes.link}
						onClick={toggleLinks}
					>
						<Center inline>
							<Box component='span' mr={5}>
								Create a post
							</Box>
							<IconChevronDown
								size={16}
								color={theme.colors.blue[6]}
							/>
						</Center>
					</UnstyledButton>
					<Collapse in={linksOpened}>{links}</Collapse>
					<a href='/help' className={classes.link}>
						Get Help
					</a>
					<a href='/news' className={classes.link}>
						News
					</a>

					<Divider my='sm' />

					<Group justify='center' grow pb='xl' px='md'>
						<Button onClick={goToLogin}>Log in</Button>
						<Button variant='default' onClick={goToRegister}>
							Sign up
						</Button>
					</Group>
				</ScrollArea>
			</Drawer>
		</Box>
	);
};

export default Header;
