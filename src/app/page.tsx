import BadgeCard from '@/components/card/BadgeCard';
import classes from './page.module.css';
import { FooterSocial } from '@/components/footer/FooterSocial';

const Home = () => {
	return (
		<div className={classes.main_page_container}>
			<BadgeCard />
			<BadgeCard />
			<FooterSocial />
		</div>
	);
};

export default Home;
