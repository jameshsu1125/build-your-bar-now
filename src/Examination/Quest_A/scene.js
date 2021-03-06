import React from 'react';
import $ from 'jquery';
require('jquery-easing');

import Stage_A from './stage_a';
import Stage_B from './stage_b';
import Stage_C from './stage_c';
import Stage_D from './stage_d';

export default class scene extends React.Component {
	constructor(props) {
		super(props);
		const root = this;
		this.tr = {
			touchs: { mx: 0, offset: 50 },
			init() {
				this.ar = new this.Arrow('ar');
				this.al = new this.Arrow('al');
				this.img.init();
			},
			in() {
				this.ar.in();
				this.al.in();
				this.img.in();
			},
			goto(v) {
				this.img.goto(v);
			},
			next() {
				if (!this.img.is) return;
				this.img.is = false;
				this.img.next();
				root.props.next();
			},
			prev() {
				if (!this.img.is) return;
				this.img.is = false;
				this.img.prev();
				root.props.prev();
			},
			evt() {
				this.touchMove = (e) => {
					if (e.cancelable) if (!e.defaultPrevented) e.preventDefault();
					if (!this.touchs.is) return;
					let x = e.clientX || e.targetTouches[0].clientX;
					let dx = this.touchs.mx - x;
					if (dx > this.touchs.offset) {
						this.touchs.is = false;
						this.next();
					} else if (dx < 0 - this.touchs.offset) {
						this.touchs.is = false;
						this.prev();
					}
				};
				this.mouseup = () => {
					this.isPress = false;
				};
				root.props.TouchEvent.add('touch', (e) => {
					this.touchs.mx = e.clientX || e.targetTouches[0].clientX;
					this.touchs.is = true;
				});
				root.refs.touch.addEventListener('touchmove', this.touchMove, {
					passive: false,
					capture: false,
				});
				root.refs.touch.addEventListener('mousemove', this.touchMove);
				document.addEventListener('touchend', this.mouseup);
				document.addEventListener('mouseup', this.mouseup);
			},
			img: {
				l: 0,
				time: 1000,
				index: 0,
				is: false,
				init() {
					this.c = $(root.refs.imgc);
					this.tran();
				},
				goto(v) {
					if (!this.is) return;
					this.is = false;
					this.index = v;
					this.moveTo();
				},
				prev() {
					this.index--;
					this.moveTo();
				},
				next() {
					this.index++;
					this.moveTo();
				},
				in() {
					this.index = 1;
					this.moveTo(true);
				},
				isView() {
					if (this.index < 1) this.index = 4;
					else if (this.index > 4) this.index = 1;
					this.l = this.index * -768;
					this.tran();
					this.is = true;
				},
				moveTo(is) {
					$(this).animate(
						{ l: this.index * -768 },
						{
							duration: this.time,
							step: () => this.tran(),
							complete: () => {
								this.isView();
								this.playScene();
								if (is) this.ined();
								setTimeout(() => {
									this.isView();
								}, 50);
							},
							easing: 'easeOutQuart',
						}
					);
				},
				ined() {
					root.refs.dc.style.opacity = 1;
					root.tr.evt();
				},
				playScene() {
					let stage = [false, 'stage_a', 'stage_b', 'stage_c', 'stage_d'];
					for (var i in stage) {
						if (stage[i]) {
							if (this.index == i) root.refs[stage[i]].play();
							else root.refs[stage[i]].stop();
						}
					}
				},
				tran() {
					this.c.css('left', this.l + 'px');
				},
			},
			Arrow(div) {
				this.c = $(root.refs[div]);
				this.time = 500;
				this.o = 0;
				this.tran = () => {
					this.c.css('opacity', this.o);
				};
				this.in = () => {
					$(this).animate(
						{ o: 1 },
						{
							duration: this.time,
							step: () => this.tran(),
							complete: () => this.tran(),
							easing: 'easeOutQuart',
						}
					);
				};
				this.ar = () => {
					root.tr.next();
				};
				this.al = () => {
					root.tr.prev();
				};
				root.props.TouchEvent.add(div, () => {
					this[div]();
				});
				this.tran();
			},
		};
	}

	componentDidMount() {
		this.tr.init();
	}

	componentWillUnmount() {
		this.props.TouchEvent.remove('ar');
		this.props.TouchEvent.remove('al');
		this.props.TouchEvent.remove('touch');
		document.removeEventListener('mouseup', this.tr.mouseup);
		document.removeEventListener('touchend', this.tr.mouseup);
		this.refs.touch.removeEventListener('touchmove', this.tr.touchMove);
		this.refs.touch.removeEventListener('mousemove', this.tr.touchMove);
	}

	goto(v) {
		this.tr.goto(v);
	}

	in() {
		this.tr.in();
	}

	is() {
		return this.tr.img.is;
	}

	render() {
		return (
			<div ref='img' className='image'>
				<div ref='imgc' className='img-c'>
					<div ref='dc' className='img_dc'>
						<Stage_D />
					</div>
					<div className='img_a'>
						<Stage_A ref='stage_a' />
					</div>
					<div className='img_b'>
						<Stage_B ref='stage_b' />
					</div>
					<div className='img_c'>
						<Stage_C ref='stage_c' />
					</div>
					<div className='img_d'>
						<Stage_D ref='stage_d' />
					</div>
					<div className='img_ac'>
						<Stage_A />
					</div>
				</div>
				<div ref='touch' id='touch' className='touch'></div>
				<div id='al' ref='al' className='arr l'></div>
				<div id='ar' ref='ar' className='arr r'></div>
			</div>
		);
	}
}
