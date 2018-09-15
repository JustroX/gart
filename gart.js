/*
	Gart v1.0.1
	Generative Art Library
	(c) Justine Che T. Romero 2018

*/




class Gart
{
	constructor(options, _f)
	{
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext('2d');
		this.fps  = options.fps | 30;
		this.particles = [];
		this.generator = [];
		this.time = 0;
		this.playing = false;
		_f(this);
	}

	start()
	{
		this.playing = true;
		this.loop();
	}
	pause()
	{
		this.playing = false;
	}

	loop()
	{
		this.step();
		this.draw();
		this.time++;
		setTimeout(()=>{ if(this.playing)this.loop()},1000/this.fps);
	}

	step()
	{
		for(let i of this.generator)
			i.step(this.time);
		for(let i of this.particles)
			i.step(this.time);
	}

	draw()
	{
		for(let i of this.particles)
			i.draw(this.ctx);
	}

	//public

	addParticle(p)
	{
		p.parent = this;
		let a = new Particle(p);
		this.particles.push(a);
		return a;
	}
}

class Particle
{
	constructor(p)
	{
		this.x = p.x || 0 ;
		this.y = p.y || 0 ;
		this.r = p.r || 10;
		this.style = p.style || "rgba(0,0,0)";
		this.vx = p.vx || 0 ;
		this.vy = p.vy || 0 ;
		this.ax  = p.ax || 0;
		this.ay  = p.ay || 0;
		this.behaviors = p.behaviors || [];
		this.time = p.time | 0;
		this.tags = p.tags || [];
		this.parent = p.parent;
	}

	step(t)
	{
		for(let i of this.behaviors)
			i(this);

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
		this.r = Math.max(0,this.r);
		this.time++;
	}

	pull(mag,tag)
	{
		if(!this.parent) return;
		for(let i of this.parent.particles)
			if(i.includes(tag) || !tag )
			{
				let dx = i.x - this.x;
				let dy = i.y - this.y;
				ax += dx;
				ay += dy;
			}
	}


	draw(ctx)
	{
		ctx.beginPath();


		ctx.arc(	
				Math.floor(this.x),
				Math.floor(this.y),
				Math.floor(this.r)
				,0,2*Math.PI);
		ctx.fillStyle = this.style;
		ctx.fill();

		ctx.closePath();
	}
}

class Generators
{
	constructor()
	{
		
	}
}