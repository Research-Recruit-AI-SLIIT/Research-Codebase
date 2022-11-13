import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className='w-100 py-4 flex-shrink-0 mt-5'>
			<div className='container py-4'>
				<div className='row gy-4 gx-5'>
					<div className='col-lg-4 col-md-6'>
						<h5 className='h1 text-white'>
							<img
								src='https://i.imgur.com/0qCMsNC.jpg'
								alt=''
								width={'200px'}
							/>
						</h5>
						<p className='small text-muted'>
							Lorem ipsum dolor sit amet, consectetur adipisicing
							elit, sed do eiusmod tempor incididunt.
						</p>
						<p className='small text-muted mb-0'>
							&copy; Copyrights. All rights reserved.{' '}
							<a className='text-primary' href='#'>
								recruitai.com
							</a>
						</p>
					</div>
					<div className='col-lg-4 col-md-6'>
						<h5 className='text-white mb-3'>Quick links</h5>
						<ul className='list-unstyled text-muted'>
							<li>
								<Link to='/'>Home</Link>
							</li>
							<li>
								<Link to='/'>About</Link>
							</li>
							<li>
								<Link to='/'>Get started</Link>
							</li>
							<li>
								<Link to='/'>FAQ</Link>
							</li>
						</ul>
					</div>

					<div className='col-lg-4 col-md-6'>
						<h5 className='text-white mb-3'>Newsletter</h5>
						<p className='small text-muted'>
							Lorem ipsum dolor sit amet, consectetur adipisicing
							elit, sed do eiusmod tempor incididunt.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
