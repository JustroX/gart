/*
	Gart v1.0.1
	Generative Art Library
	(c) Justine Che T. Romero 2018

*/




class Gart
{
	constructor(options)
	{
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext('2d');
		this.fps  = options.fps | 30;
		this.particles = [];
		this.time = 0;
		this.playing = false;
		this.animate = options.animate || false;

		this.canvas.addEventListener('click',(ev)=>{
			if(!this.playing) this.start();
			else this.pause();
		});

		this.resources  = new GModule();
		this.modules = options.modules || [];
		for(let i of this.modules)
			this.resources.import(window[i]);

		this.defined_step = options.onstep || ((g)=>{});

		if(options.oncreate)
			options.oncreate(this);
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
		if(this.animate)
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.step();
		this.draw();
		this.time++;
		setTimeout(()=>{ if(this.playing)this.loop()},1000/this.fps);
	}

	step()
	{
		this.defined_step(this);
		for(let i of this.particles)
			i.step(this.time);
	}

	draw()
	{
		for(let i of this.particles)
			i.draw(this.ctx,i);
	}

	//public

	addParticle(p,ops)
	{
		if(typeof p == "string")
			p = this.getParticle(p,ops);
		p.parent = this;
		let a = new Particle(p);
		this.particles.push(a);
		return a;
	}

	getStyleRGB(r,g,b,a)
	{
		return "rgba("+r+","+g+","+b+","+(a?a:1)+")";
	}
	getStyleHSL(h,s,l,a)
	{
		return "hsla("+Math.floor(h)%360+","+s+"%,"+l+"%,"+(a?a:1)+")";
	}


	getParticle(n,ops)
	{
		return this.resources.getParticle(n,ops);
	}
	getBehavior(n,ops)
	{
		return this.resources.getBehavior(n,ops);
	}
}


class Particle
{
	constructor(p)
	{
		this.x = p.x || 0 ;
		this.y = p.y || 0 ;
		this.r = p.r || 10;
		this.style = p.style || "#ffffff";
		this.stroke = p.stroke || "green";
		this.vx = p.vx || 0 ;
		this.vy = p.vy || 0 ;
		this.ax  = p.ax || 0;
		this.ay  = p.ay || 0;
		this.time = p.time | 0;
		this.tags = p.tags || [];
		this.parent = p.parent;
		this.draw = p.draw || this.draw;
		this.onstep = p.onstep || ((g)=>{});
		this.lifetime = p.lifetime || -1;

		for(let i in p)
		{
			if(!this[i])
				this[i] = p[i];
		}
		this.behaviors = p.behaviors || [];
	}

	step(t)
	{
		for(let i of this.behaviors)
		{
			if(typeof i == "string")
				this.parent.getBehavior(i)(this,this.parent);
			else
			i(this,this.parent);
		}

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
		this.r = Math.max(0,this.r);
		this.time++;

		this.onstep(this);

		if( this.lifetime >0 && this.time >= this.lifetime)
			this.destroy();
	}

	pull(mag,tag)
	{
		if(!this.parent) return;
		let sx = 0, sy = 0;
		for(let i of this.parent.particles)
		{
			// console.log(mag);
			
			if(i.tags.includes(tag) || !tag )
			{
				let dx = i.x - this.x;
				let dy = i.y - this.y;
				// console.log(dx);
				let d = Math.sqrt(dx*dx + dy*dy);

				if(d!=0)
				{
					sx += mag*dx/d;
					sy += mag*dy/d;
				}
			}
		}
		this.ax = sx;
		this.ay = sy;
	}

	destroy()
	{
		let index = this.parent.particles.indexOf(this);
		// console.log(index);
		this.parent.particles.splice(index,1);
	}

	draw(ctx,o)
	{
		ctx.beginPath();


		ctx.arc(	
				Math.floor(this.x),
				Math.floor(this.y),
				Math.floor(this.r)
				,0,2*Math.PI);
		ctx.fillStyle = this.style;
		ctx.fill();

		ctx.strokeStyle = this.stroke;
		ctx.stroke();

		ctx.closePath();
	}
}

/*
{
	"name":{ definition }, 
}
*/

class GModule
{
	constructor()
	{
		this.particles  = {};
		this.behaviors = {};
	}

	import(p)
	{
		for( let i in p.particles )
			this.particles[i] = p.particles[i];
		for( let i in p.behaviors )
			this.behaviors[i] = p.behaviors[i];
	}

	getParticle(n,ops)
	{
		if(!this.particles[n])
			return console.log("Gart: Particle "+n+" not found.");
		let a = JSON.parse(JSON.stringify( this.particles[n] ));
		a.behaviors = this.particles[n].behaviors; 
		for(let i in ops)
		{
			if(typeof ops[i] == 'object')
				for(let j in ops[i])
					a[i][j] = ops[i][j];
			else
					a[i] = ops[i];
		}
		return a;

	}

	getBehavior(n)
	{
		if(!this.behaviors[n])
			return console.log("Gart: Behavior "+n+" not found.");
		return this.behaviors[n]; 
	}



}