import React from 'react';
import './submit.less';
import $ from 'jquery';
require('jquery-easing');

import { Pad } from 'UNIT/Number';

export default class submit extends React.Component {
	constructor(props) {
		super(props);
		const root = this;
		//script
		this.tr = {
			b: -110,
			time: 500,
			is: true,
			color: parseInt('ff', 16),
			init() {
				this.c = $(root.refs.main);
				this.btn = $(root.refs.btn);
				this.tran();
				this.tran2();
			},
			out() {
				$(this).animate(
					{ b: -110 },
					{
						duration: this.time,
						step: () => this.tran(),
						complete: () => {
							this.tran();
							root.props.destory();
						},
						easing: 'easeOutQuart',
					}
				);
			},
			in() {
				$(this)
					.delay(500)
					.animate(
						{ b: 30 },
						{
							duration: this.time,
							step: () => this.tran(),
							complete: () => {
								this.tran();
								this.evt();
							},
							easing: 'easeOutQuart',
						}
					);
			},
			evt() {
				root.props.TouchEvent.add('submit_btn', () => {
					if (!this.is) return;
					this.is = false;
					this.hide();
					root.props.click();
				});
			},
			tran() {
				this.c.css('bottom', this.b + 'px');
			},
			hide() {
				$(this).animate(
					{
						color: parseInt('66', 16),
					},
					{
						duration: this.time,
						step: () => this.tran2(),
						complete: () => this.tran2(),
						easing: 'easeOutQuart',
					}
				);
			},
			show() {
				$(this).animate(
					{
						color: parseInt('ff', 16),
					},
					{
						duration: this.time,
						step: () => this.tran2(),
						complete: () => {
							this.tran2();
							this.is = true;
						},
						easing: 'easeOutQuart',
					}
				);
			},
			tran2() {
				let c = Pad(Math.round(this.color).toString(16), 2);
				this.btn.css({
					color: '#' + c + c + c,
					border: `solid #${c + c + c} 2px`,
				});
			},
		};
	}

	out() {
		this.tr.out();
	}

	in() {
		this.tr.in();
	}

	show() {
		this.tr.show();
	}

	componentDidMount() {
		this.tr.init();
	}

	componentWillUnmount() {
		this.props.TouchEvent.remove('submit_btn');
	}

	render() {
		return (
			<div id='submit' ref='main'>
				<div ref='btn' id='submit_btn' className='submit_btn'>
					送出
				</div>
			</div>
		);
	}
}