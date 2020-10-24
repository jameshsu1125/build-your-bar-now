import React from 'react';
import './guad2.less';

import $ from 'jquery';
require('jquery-easing');
require('jquery.waitforimages');

export default class guad2 extends React.Component {
	constructor(props) {
		super(props);
		const root = this;
		this.tr = {
			y: window.innerHeight,
			time: 500,
			init() {
				this.c = $(root.refs.guad);
				this.tran();
			},
			evt() {
				root.props.TouchEvent.add('close', () => {
					root.props.TouchEvent.remove('close');
					this.out();
				});
			},
			out() {
				$(this).animate(
					{ y: window.innerHeight },
					{
						duration: this.time,
						step: () => this.tran(),
						complete: () => {
							this.tran();
							root.props.destory();
						},
						easing: 'easeInQuart',
					}
				);
			},
			in() {
				$(this).animate(
					{ y: 0 },
					{
						duration: this.time,
						step: () => this.tran(),
						complete: () => {
							this.tran();
							this.evt();
						},
						easing: 'easeOutBack',
					}
				);
			},
			tran() {
				this.c.css('top', this.y + 'px');
			},
		};
	}

	componentDidMount() {
		this.tr.init();
		$(this.refs.main).waitForImages({
			finished: () => this.tr.in(),
			each: (e) => {},
			waitForAll: true,
		});
	}

	render() {
		return (
			<div ref='main' id='guad' className='g2'>
				<div ref='guad' className='guad-c'>
					<div className='row title'>清雅甘淨</div>
					<div className='row table'>
						<div className='table-row'>
							<div className='table-cell l'>
								<div className='circle'>色</div>
							</div>
							<div className='table-cell r'>清亮透明</div>
						</div>
						<div className='table-row'>
							<div className='table-cell l'>
								<div className='circle'>香</div>
							</div>
							<div className='table-cell r'>
								清香優雅
								<br />
								前段：花蜜香、醇甜香
								<br />
								🈝段：甜瓜果香、清香糧香
							</div>
						</div>
						<div className='table-row'>
							<div className='table-cell l'>
								<div className='circle'>味</div>
							</div>
							<div className='table-cell r'>
								甘美綿柔、醇和淨爽、酸澀適中，
								<br />
								回味怡暢。
							</div>
						</div>
					</div>
					<div id='close' className='close'></div>
				</div>
			</div>
		);
	}
}