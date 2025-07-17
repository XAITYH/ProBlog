import BadgeCard from '@/components/card/BadgeCard';
import classes from './page.module.css';
import { FooterSocial } from '@/widgets/footer/FooterSocial';
import { TopicControl } from '@/widgets/topicControl/TopicControl';

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
