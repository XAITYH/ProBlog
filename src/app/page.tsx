import BadgeCard from '@/components/card/BadgeCard';
import classes from './page.module.css';
import { FooterSocial } from '@/components/footer/FooterSocial';
import { TopicControl } from '@/components/segmentedControl/TopicControl';

const Home = () => {
	return (
		<div className={classes.main_page_container}>
			<TopicControl />
			<BadgeCard />
			<FooterSocial />
		</div>
	);
};

export default Home;
