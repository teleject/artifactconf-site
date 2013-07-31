 <div class="site_footer">
                    <div class="section" id="footer_nav" >  
                        <div>
                            <h2 class="section-header">Navigation</h2>
                            <ul class="nav clearfix">
                                <li><a class="scroll_button" data-nav="#pagetop"  href="/">Home</a></li>
                                <li><a <?php if($page == 'index'): ?>class="scroll_button"<?php endif; ?> data-nav="#speakers" href="<?php echo $config['root']; ?>#speakers">Speakers</a></li>
                                <li><a <?php if($page == 'index'): ?>class="scroll_button"<?php endif; ?> data-nav="#program" href="<?php echo $config['root']; ?>#program">Program</a></li>
                                <li><a <?php if($page == 'index'): ?>class="scroll_button"<?php endif; ?> data-nav="#location" href="<?php echo $config['root']; ?>#location">Location</a></li>
                                <li><a href="sponsors.php">Sponsor</a></li>
                                <li><a href="privacy.php">Privacy Policy</a></li>
                                <li><a href="terms.php">Terms</a></li>
                            </ul>
                        </div> 
                    </div>
                    <p>Copyright &copy; 2013 <a href="http://environmentsforhumans.com/">Environments for Humans</a>, <a href="http://unmatchedstyle.com/">UnmatchedStyle</a> & <a href="http://www.jenville.com/">Jennifer Robbins</a></p>
                </div>

            </div> <!-- END #constellations -->

            

        </div> <!-- END #main-container -->

        <script src="js/vendor/jquery.js"></script>
        <script src="js/main.js"></script>



    </body>
</html>
