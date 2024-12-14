const Contact = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input type="text" placeholder="Your name" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea placeholder="Your message" className="h-32" />
            </div>
            
            <Button className="w-full">Send Message</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Connect</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">support@popcultureusa.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">(555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground">
                123 Pop Culture Street<br />
                Suite 100<br />
                Los Angeles, CA 90001
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;