import React from 'react';

import { Text } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';

const Loading = () => {
	return (
		<Text className='text-center'>
			Loading... <IconLoader />
		</Text>
	);
};

export default Loading;
