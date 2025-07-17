import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import {
	ActionIcon,
	Group,
	useComputedColorScheme,
	useMantineColorScheme
} from '@mantine/core';
import classes from './themeToggleButton.module.css';

const ThemeToggleButton = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme('light', {
		getInitialValueInEffect: true
	});

	return (
		<Group justify='center'>
			<ActionIcon
				onClick={() =>
					setColorScheme(
						computedColorScheme === 'light' ? 'dark' : 'light'
					)
				}
				variant='default'
				radius='md'
				aria-label='Toggle color scheme'
				className={cx(classes.action_icon)}
			>
				<IconSun
					className={cx(classes.icon, classes.light)}
					stroke={1.5}
				/>
				<IconMoon
					className={cx(classes.icon, classes.dark)}
					stroke={1.5}
				/>
			</ActionIcon>
		</Group>
	);
};

export default ThemeToggleButton;
