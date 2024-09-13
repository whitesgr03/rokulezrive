import { useState } from 'react';

import style from './style.module.css';
import { icon } from '../../utils/icon.module.css';

export const Mobile_nav = () => {
	const [active, setActive] = useState(false);

	return (
		<nav className={style['mobile-nav']}>
			<ul className={style['mobile-nav-list']}>
				<li className={style['mobile-nav-item']}>
					<a href="/drive" className={style['mobile-nav-link']}>
						<span className={`${icon} ${style.home}`} />
						Home
					</a>
				</li>
				<li className={style['mobile-nav-item']}>
					<a href="/drive/shared" className={style['mobile-nav-link']}>
						<span className={`${icon} ${style.shared}`} />
						Shared
					</a>
				</li>
				<li className={style['mobile-nav-item']}>
					<a href="/drive/files" className={style['mobile-nav-link']}>
						<span className={`${icon} ${style.drive}`} />
						Files
					</a>
				</li>
			</ul>
			<div className="upload">
				<button type="button" className={style['upload-button']}>
					<span className={`${icon} ${style.plus}`} />
				</button>
				<ul
					className={`${style['upload-list']} ${active ? style['is-active'] : ''}`}
				>
					<li>
						<a href="/drive/files/create" className={style['upload-link']}>
							<span className={`${icon} ${style['upload-file']})`} />
						</a>
					</li>
					<li>
						<a href="/drive/folders/create" className={style['upload-link']}>
							<span className={`${icon} ${style['create-folder']})`} />
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};
